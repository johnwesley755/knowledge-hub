# 🧠 Knowledge Hub - AI-Powered Collaborative Document Management

> A modern MERN stack application with Gemini AI integration for intelligent document management, semantic search, and team collaboration.

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green.svg)](https://www.mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini%20AI-Integrated-orange.svg)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🌟 Features

### 🔐 **Authentication & Authorization**
- JWT-based secure authentication
- Role-based access control (User/Admin)
- Protected routes and API endpoints
- Password encryption with bcrypt

### 📝 **Document Management**
- **Full CRUD Operations**: Create, read, update, delete documents
- **AI-Powered Summaries**: Automatic content summarization using Gemini AI
- **Smart Tagging**: Auto-generated relevant tags for better organization
- **Version History**: Complete document versioning with change tracking
- **Rich Categories**: Research, Documentation, Meeting Notes, Projects, etc.
- **Status Management**: Draft, Published, Archived workflows

### 🤝 **Collaboration Features**
- **Real-time Collaboration**: Live updates using Socket.io
- **Permission Management**: Read, Edit, Admin access levels
- **Team Invitations**: Add collaborators via email
- **Activity Tracking**: Comprehensive audit logs
- **Visibility Controls**: Private, Team, Public document sharing

### 🔍 **Advanced Search**
- **Text Search**: Full-text search across titles, content, and tags
- **Semantic Search**: AI-powered contextual document discovery
- **Smart Suggestions**: Real-time search recommendations
- **Advanced Filters**: Category, author, status, date-based filtering
- **Fast Performance**: Optimized database indexing

### 🤖 **AI Integration**
- **Gemini AI**: Google's latest AI model integration
- **Document Summarization**: Automatic content analysis
- **Tag Generation**: Intelligent keyword extraction
- **Q&A System**: Ask questions about your documents
- **Semantic Understanding**: Context-aware search capabilities

### 📊 **Analytics & Insights**
- **Document Metrics**: Views, likes, downloads tracking
- **Activity Dashboard**: User engagement analytics
- **Collaboration Stats**: Team performance insights
- **Usage Patterns**: Document lifecycle tracking

## 🏗️ Architecture

### **Backend (Node.js + Express)**
```
server/
├── config/           # Database & AI configuration
├── controllers/      # Request handlers
├── middleware/       # Authentication, validation, error handling
├── models/          # MongoDB schemas
├── routes/          # API endpoint definitions
├── services/        # Business logic & AI integration
├── utils/           # Helper functions
└── scripts/         # Database setup & maintenance
```

### **Frontend (React + Vite)**
```
client/
├── src/
│   ├── components/   # React components
│   │   ├── Auth/     # Login, Register
│   │   ├── Dashboard/# Main dashboard & activity feed
│   │   ├── Documents/# Document management
│   │   ├── Search/   # Search functionality
│   │   ├── QA/       # Q&A system
│   │   ├── Profile/  # User profile management
│   │   ├── Common/   # Shared components
│   │   └── UI/       # Reusable UI components
│   ├── hooks/        # Custom React hooks
│   ├── services/     # API integration
│   ├── context/      # State management
│   └── utils/        # Helper functions
└── public/
```

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18.x or higher
- **MongoDB**: v6.x or higher
- **Gemini API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)

### 1. Clone Repository
```bash
git clone https://github.com/johnwesley755/knowledge-hub.git
cd knowledge-hub
```

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
```

Configure your environment variables in `.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/knowledge-hub
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRE=30d
GEMINI_API_KEY=your-gemini-api-key
CLIENT_URL=http://localhost:3000
```

Create database indexes:
```bash
npm run create-indexes
```

Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
cp .env.example .env
```

Configure environment variables in `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Knowledge Hub
```

Start the development server:
```bash
npm run dev
```

### 4. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health

## 📋 API Documentation

### Authentication Endpoints
```http
POST   /api/auth/register      # User registration
POST   /api/auth/login         # User login
GET    /api/auth/me            # Get current user
PUT    /api/auth/profile       # Update profile
```

### Document Management
```http
GET    /api/documents          # Get all documents
POST   /api/documents          # Create document
GET    /api/documents/:id      # Get single document
PUT    /api/documents/:id      # Update document
DELETE /api/documents/:id      # Delete document
GET    /api/documents/:id/versions  # Get version history
POST   /api/documents/:id/like      # Toggle like
```

### Collaboration
```http
GET    /api/documents/:id/collaborators           # Get collaborators
POST   /api/documents/:id/collaborators           # Add collaborator
PUT    /api/documents/:id/collaborators/:userId   # Update permissions
DELETE /api/documents/:id/collaborators/:userId   # Remove collaborator
```

### Search
```http
GET    /api/search/text        # Text-based search
POST   /api/search/semantic    # AI semantic search
GET    /api/search/suggestions # Search suggestions
```

### Q&A System
```http
POST   /api/qa/ask             # Ask AI questions
GET    /api/qa/history/:id     # Get Q&A history
```

### User Management
```http
GET    /api/users/search       # Search users
GET    /api/users/collaborations/invites  # Get collaboration invites
```

## 🎨 UI Components

### Core Components
- **Dashboard**: Activity feed, document overview, quick actions
- **DocumentForm**: Rich document editor with real-time preview
- **SearchPage**: Dual search modes (text + semantic)
- **CollaboratorManager**: Team management interface
- **Profile**: User settings and preferences
- **QA Interface**: AI-powered question answering

### Reusable UI Components
- **Modal**: Flexible modal dialogs
- **Button**: Consistent button styling
- **Avatar**: User profile pictures
- **Badge**: Status indicators
- **LoadingSpinner**: Loading states
- **Tooltip**: Contextual help
- **TagChip**: Document tags

## 🔧 Development

### Available Scripts

**Backend:**
```bash
npm start          # Production server
npm run dev        # Development server with nodemon
npm run create-indexes  # Setup database indexes
npm test           # Run tests
```

**Frontend:**
```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # ESLint checking
```

### Code Structure Guidelines

**Backend:**
- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic and external API calls
- **Middleware**: Authentication, validation, error handling
- **Models**: Database schema definitions
- **Utils**: Pure helper functions

**Frontend:**
- **Components**: Reusable React components
- **Hooks**: Custom React hooks for data fetching
- **Services**: API integration layer
- **Context**: Global state management
- **Utils**: Client-side helper functions

### Database Schema

**Users Collection:**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['user', 'admin'],
  avatar: String,
  preferences: Object,
  lastActive: Date
}
```

**Documents Collection:**
```javascript
{
  title: String,
  content: String,
  summary: String (AI-generated),
  tags: [String] (AI-generated),
  category: String,
  author: ObjectId,
  collaborators: [{
    user: ObjectId,
    permissions: ['read', 'edit', 'admin'],
    addedAt: Date
  }],
  visibility: ['private', 'team', 'public'],
  status: ['draft', 'published', 'archived'],
  embedding: [Number] (for semantic search),
  metrics: {
    views: Number,
    likes: [ObjectId],
    downloads: Number
  }
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: API request throttling
- **CORS Protection**: Cross-origin request handling
- **Helmet.js**: Security headers
- **Input Validation**: Request data sanitization
- **Role-based Access**: Permission-based routing

## 📈 Performance Optimization

### Database Optimization
- **Indexes**: Optimized queries for search and filtering
- **Aggregation**: Efficient data processing pipelines
- **Connection Pooling**: MongoDB connection management

### Frontend Optimization
- **Code Splitting**: Dynamic imports for route-based splitting
- **React Query**: Intelligent caching and background updates
- **Image Optimization**: Compressed avatars and assets
- **Bundle Analysis**: Webpack bundle optimization

### API Optimization
- **Response Compression**: Gzip compression middleware
- **Pagination**: Efficient data loading
- **Caching**: Strategic API response caching

## 🔍 Monitoring & Analytics

### Logging
- **Morgan**: HTTP request logging
- **Custom Logging**: Application-specific logs
- **Error Tracking**: Comprehensive error reporting

### Metrics
- **User Analytics**: Document engagement tracking
- **Performance Metrics**: Response time monitoring
- **Usage Statistics**: Feature adoption tracking

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

### Contribution Guidelines
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

---

<div align="center">

**Built with ❤️ by the Knowledge Hub Team**

[⭐ Star this repo](https://github.com/johnwesley755/knowledge-hub) | [🐛 Report Bug](https://github.com/johnwesley755/knowledge-hub/issues) | [💡 Request Feature](https://github.com/johnwesley755/knowledge-hub/issues)

</div>
