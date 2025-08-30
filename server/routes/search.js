const express = require('express');
const { textSearch, semanticSearch, getSearchSuggestions } = require('../controllers/searchController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/text', protect, textSearch);
router.post('/semantic', protect, semanticSearch);
router.get('/suggestions', protect, getSearchSuggestions);

module.exports = router;
