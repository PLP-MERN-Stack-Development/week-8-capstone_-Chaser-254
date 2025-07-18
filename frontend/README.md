# Jifunze Learning Platform

> **Jifunze** (Swahili for "Learn") - A comprehensive role-based learning platform that connects passionate instructors with eager students through seamless content sharing and interactive learning experiences.
## Features

### For Students
- **Browse Learning Content** - Access videos and documents from instructors
- **Interactive Content Viewer** - Built-in video player and document viewer
- **Progress Tracking** - Monitor your learning journey
- **Responsive Design** - Learn on any device, anywhere

### For Instructors
- **Content Management** - Upload and organize videos and documents
- **File Upload System** - Support for multiple file formats (MP4, PDF, DOC, etc.)
- **Analytics Dashboard** - Track content performance and student engagement
- **Content Organization** - Categorize and manage learning materials

### Security & Authentication
- **Role-Based Access Control** - Separate experiences for students and instructors
- **JWT Authentication** - Secure token-based authentication
- **Protected Routes** - Ensure users only access authorized content
- **Password Encryption** - Secure password storage with bcrypt

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Chaser-254/jifunze-learning-platform.git
   cd jifunze-learning-platform
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Environment Setup**
   ```bash
   # In the server directory
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/jifunze
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   ```

5. **Start the application**
   
   **Backend (Terminal 1):**
   ```bash
   cd server
   npm run dev
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Project Structure

```
jifunze-learning-platform/
├── 📁 src/                          # Frontend React application
│   ├── 📁 components/
│   │   ├── 📁 auth/                 # Authentication components
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── 📁 student/              # Student dashboard
│   │   │   └── StudentDashboard.tsx
│   │   ├── 📁 instructor/           # Instructor dashboard
│   │   │   └── InstructorDashboard.tsx
│   │   ├── 📁 ui/                   # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   └── LandingPage.tsx
│   ├── 📁 contexts/                 # React contexts
│   │   └── AuthContext.tsx
│   ├── 📁 services/                 # API services
│   │   └── api.ts
│   ├── 📁 lib/                      # Utility functions
│   │   └── utils.ts
│   └── App.tsx
├── 📁 server/                       # Backend Node.js/Express
│   ├── 📁 models/                   # MongoDB models
│   │   ├── User.js
│   │   └── Content.js
│   ├── 📁 routes/                   # API routes
│   │   ├── auth.js
│   │   ├── content.js
│   │   └── users.js
│   ├── 📁 middleware/               # Custom middleware
│   │   └── auth.js
│   ├── 📁 uploads/                  # File uploads directory
│   └── server.js
├── package.json                     # Frontend dependencies
├── tailwind.config.js              # Tailwind CSS configuration
└── README.md
```

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible UI components
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful, customizable icons

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling for Node.js
- **JWT** - JSON Web Tokens for authentication
- **Multer** - Middleware for handling file uploads
- **bcryptjs** - Password hashing library
- **CORS** - Cross-Origin Resource Sharing middleware

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Content Management
- `GET /api/content` - Get all content
- `POST /api/content/upload` - Upload new content (Instructors only)
- `PUT /api/content/:id` - Update content (Instructors only)
- `DELETE /api/content/:id` - Delete content (Instructors only)
- `POST /api/content/:id/view` - Increment view count

### User Management
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/role/instructors` - Get all instructors
- `GET /api/users/role/students` - Get all students

## UI Components

The project uses **shadcn/ui** components for a consistent, accessible design system:

- **Button** - Multiple variants (default, destructive, outline, secondary, ghost, link)
- **Card** - Content containers with headers, content, and footers
- **Input** - Form input fields with proper styling
- **Dialog** - Modal dialogs for user interactions
- **Avatar** - User profile pictures with fallbacks
- **Badge** - Status indicators and labels
- **Separator** - Visual dividers for content sections

## Development

### Available Scripts

**Frontend:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

**Backend:**
```bash
npm start           # Start production server
npm run dev         # Start development server with nodemon
```

### Code Style
- **ESLint** - Code linting and formatting
- **TypeScript** - Type checking and IntelliSense
- **Prettier** - Code formatting (recommended)

## Deployment

### Frontend Deployment
1. Build the application:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to your hosting provider (Netlify, Vercel, etc.)

### Backend Deployment
1. Set up environment variables on your hosting platform
2. Deploy to platforms like Heroku, Railway, or DigitalOcean
3. Ensure MongoDB connection is configured for production

### Environment Variables for Production
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jifunze
JWT_SECRET=your_production_jwt_secret
NODE_ENV=production
```

## Contributing

We welcome contributions to Jifunze! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure responsive design compatibility

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **shadcn/ui** - For the beautiful component library
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide** - For the comprehensive icon library
- **MongoDB** - For the flexible database solution
- **Vercel** - For inspiration on modern web development practices

## Support

If you have any questions or need help with setup, please:

1. Check the [Issues](https://github.com/Chaser-254/jifunze-learning-platform/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Built with love for the learning community**

*Jifunze - Empowering education through technology*