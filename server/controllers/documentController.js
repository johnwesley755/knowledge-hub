const Document = require('../models/Document');
const DocumentVersion = require('../models/DocumentVersion');
const { createActivity } = require('../services/activityService');
const { generateSummaryAndTags, generateEmbedding } = require('../services/geminiService');

// @desc    Get all documents
// @route   GET /api/documents
// @access  Private
const getDocuments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { category, status, author } = req.query;

    // Build query
    let query = {};
    
    // User can see their own docs + public docs + docs they're collaborators on
    query.$or = [
      { author: req.user.id },
      { visibility: 'public' },
      { 'collaborators.user': req.user.id }
    ];

    if (category) query.category = category;
    if (status) query.status = status;
    if (author) query.author = author;

    const documents = await Document.find(query)
      .populate('author', 'name email avatar')
      .populate('collaborators.user', 'name email avatar')
      .populate('lastModifiedBy', 'name email')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Document.countDocuments(query);

    res.json({
      success: true,
      data: documents,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single document
// @route   GET /api/documents/:id
// @access  Private
const getDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('author', 'name email avatar')
      .populate('collaborators.user', 'name email avatar')
      .populate('lastModifiedBy', 'name email');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check permissions
    const hasAccess = document.author._id.toString() === req.user.id ||
                     document.visibility === 'public' ||
                     document.collaborators.some(c => c.user._id.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Increment view count
    document.metrics.views += 1;
    await document.save();

    // Log activity
    await createActivity(req.user.id, 'viewed', 'document', document._id, {
      title: document.title
    });

    res.json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create document
// @route   POST /api/documents
// @access  Private
const createDocument = async (req, res) => {
  try {
    const { title, content, category, visibility, collaborators } = req.body;

    // Generate AI summary and tags
    const { summary, tags } = await generateSummaryAndTags(content);
    
    // Generate embedding for semantic search
    const embedding = await generateEmbedding(content);

    const document = await Document.create({
      title,
      content,
      summary,
      tags,
      category,
      visibility: visibility || 'private',
      author: req.user.id,
      lastModifiedBy: req.user.id,
      embedding,
      collaborators: collaborators || []
    });

    await document.populate('author', 'name email avatar');

    // Create version history
    await DocumentVersion.create({
      documentId: document._id,
      version: 1,
      title,
      content,
      summary,
      tags,
      modifiedBy: req.user.id,
      changeDescription: 'Initial creation'
    });

    // Log activity
    await createActivity(req.user.id, 'created', 'document', document._id, {
      title: document.title,
      category: document.category
    });

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('document-created', {
      document: document,
      user: req.user
    });

    res.status(201).json({
      success: true,
      data: document
    });
  } catch (error) {
    console.error('Create document error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update document
// @route   PUT /api/documents/:id
// @access  Private
const updateDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check permissions
    const canEdit = document.author.toString() === req.user.id ||
                   document.collaborators.some(c => 
                     c.user.toString() === req.user.id && 
                     ['edit', 'admin'].includes(c.permissions)
                   );

    if (!canEdit) {
      return res.status(403).json({ message: 'Not authorized to edit this document' });
    }

    const { title, content, category, visibility, status } = req.body;
    
    // Create version before updating
    await DocumentVersion.create({
      documentId: document._id,
      version: document.version + 1,
      title: document.title,
      content: document.content,
      summary: document.summary,
      tags: document.tags,
      modifiedBy: req.user.id,
      changeDescription: req.body.changeDescription || 'Updated document'
    });

    // Generate new AI summary and tags if content changed
    let updates = { title, category, visibility, status };
    if (content && content !== document.content) {
      const { summary, tags } = await generateSummaryAndTags(content);
      const embedding = await generateEmbedding(content);
      updates = { ...updates, content, summary, tags, embedding };
    }

    const updatedDocument = await Document.findByIdAndUpdate(
      req.params.id,
      {
        ...updates,
        lastModifiedBy: req.user.id,
        version: document.version + 1
      },
      { new: true, runValidators: true }
    ).populate('author', 'name email avatar')
     .populate('lastModifiedBy', 'name email');

    // Log activity
    await createActivity(req.user.id, 'updated', 'document', document._id, {
      title: updatedDocument.title,
      changes: Object.keys(updates)
    });

    // Emit real-time update
    const io = req.app.get('io');
    io.to(document._id.toString()).emit('document-updated', {
      document: updatedDocument,
      user: req.user
    });

    res.json({
      success: true,
      data: updatedDocument
    });
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check permissions (only author or admin collaborator can delete)
    const canDelete = document.author.toString() === req.user.id ||
                     document.collaborators.some(c => 
                       c.user.toString() === req.user.id && c.permissions === 'admin'
                     );

    if (!canDelete) {
      return res.status(403).json({ message: 'Not authorized to delete this document' });
    }

    await document.remove();
    
    // Delete version history
    await DocumentVersion.deleteMany({ documentId: req.params.id });

    // Log activity
    await createActivity(req.user.id, 'deleted', 'document', document._id, {
      title: document.title
    });

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('document-deleted', {
      documentId: document._id,
      user: req.user
    });

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get document versions
// @route   GET /api/documents/:id/versions
// @access  Private
const getDocumentVersions = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const versions = await DocumentVersion.find({ documentId: req.params.id })
      .populate('modifiedBy', 'name email avatar')
      .sort({ version: -1 });

    res.json({
      success: true,
      data: versions
    });
  } catch (error) {
    console.error('Get document versions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Toggle document like
// @route   POST /api/documents/:id/like
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const liked = document.metrics.likes.includes(req.user.id);
    
    if (liked) {
      document.metrics.likes = document.metrics.likes.filter(
        id => id.toString() !== req.user.id
      );
    } else {
      document.metrics.likes.push(req.user.id);
      
      // Log activity
      await createActivity(req.user.id, 'liked', 'document', document._id, {
        title: document.title
      });
    }

    await document.save();

    res.json({
      success: true,
      liked: !liked,
      likesCount: document.metrics.likes.length
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  getDocumentVersions,
  toggleLike
};