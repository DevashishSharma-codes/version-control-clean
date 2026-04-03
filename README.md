# VCTRL - Modern Version Control Platform

## 🚀 Project Overview

**VCTRL** (Version Control) is a modern, full-stack version control platform designed for lightning-fast git operations and AI-powered code review. It provides a comprehensive solution for modern development teams to collaborate, manage repositories, and maintain code quality through intelligent automation.

### 🎯 Key Features

- **Repository Management**: Create, manage, and organize code repositories with file upload capabilities
- **AI-Powered Code Review**: Automated code analysis using Google's Gemini AI for quality assessment
- **User Authentication**: Secure login/signup system with JWT-based authentication
- **Interactive Dashboard**: Modern UI with repository analytics, tech stack visualization, and contribution tracking
- **Real-time Collaboration**: Socket.io integration for live updates and team collaboration
- **File Management**: Support for multiple file types with cloud storage integration
- **Issue Tracking**: Built-in issue management system for project organization
- **Tech Stack Analytics**: Visual representation of technology distribution across repositories

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - Modern UI framework with latest features
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **Framer Motion** - Advanced animations and transitions
- **GSAP** - High-performance animations
- **Chart.js & React-Chartjs-2** - Data visualization and analytics
- **Recharts** - Additional charting capabilities
- **Three.js & React Three Fiber** - 3D graphics and WebGL effects
- **Leaflet & React Leaflet** - Interactive maps
- **Lucide React** - Modern icon library
- **React Markdown** - Markdown rendering for code reviews
- **Lottie React** - Animation support
- **Axios** - HTTP client for API communication

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT (JSON Web Tokens)** - Secure authentication
- **Bcrypt** - Password hashing and security
- **Socket.io** - Real-time bidirectional communication
- **Multer** - File upload handling
- **AWS SDK** - Cloud storage integration
- **Supabase** - Backend-as-a-Service for additional features
- **OpenAI API** - AI integration for code analysis
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

### Development Tools
- **ESLint** - Code linting and quality assurance
- **Git** - Version control
- **NPM** - Package management

## 🏗️ Project Structure

```
version-control/
├── backend/                 # Node.js/Express backend
│   ├── config/             # Configuration files (Supabase, etc.)
│   ├── controllers/        # Business logic controllers
│   ├── middleware/         # Authentication and authorization
│   ├── models/            # MongoDB schemas and models
│   ├── routes/            # API route definitions
│   └── index.js           # Server entry point
├── frontend/              # React frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── auth/      # Authentication components
│   │   │   ├── dashboard/ # Dashboard and analytics
│   │   │   ├── repo/      # Repository management
│   │   │   ├── codeReview/# AI code review features
│   │   │   └── user/      # User profile components
│   │   ├── assets/        # Images and static files
│   │   └── main.jsx       # Application entry point
│   └── vite.config.js     # Vite configuration
└── README.md              # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd version-control
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create `.env` files in both backend and frontend directories:
   
   **Backend `.env`:**
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   PORT=3000
   ```

   **Frontend `.env`:**
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

5. **Start the Application**
   
   **Backend:**
   ```bash
   cd backend
   npm start
   ```
   
   **Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

## 📱 Features in Detail

### 🔐 Authentication System
- Secure user registration and login
- JWT-based session management
- Password hashing with bcrypt
- Protected routes and middleware

### 📊 Dashboard Analytics
- Repository creation trends (30-day charts)
- Global repository browser with search
- Personal repository management
- Tech stack distribution visualization
- Contribution heatmaps and activity tracking

### 🤖 AI Code Review
- Integration with Google Gemini AI
- Automated code quality assessment
- Markdown-formatted review reports
- Support for multiple programming languages
- Real-time code analysis and feedback

### 📁 Repository Management
- Create repositories with file uploads
- Support for multiple file types (.js, .py, .cpp, .java, .txt, .zip, .tar)
- Public/private repository visibility
- File organization and management
- Repository sharing and collaboration

### 🎨 Modern UI/UX
- Dark theme with glassmorphism design
- Responsive layout for all devices
- Interactive animations and transitions
- 3D WebGL effects and visual enhancements
- Intuitive navigation and user experience

### 🔧 Issue Tracking
- Create and manage project issues
- Issue status tracking (open/closed)
- Repository-specific issue organization
- Team collaboration on problem resolution

## 🌐 API Endpoints

### Authentication
- `POST /signup` - User registration
- `POST /login` - User authentication

### Repository Management
- `GET /repo` - Get all repositories
- `POST /repo/create` - Create new repository
- `GET /repo/:id` - Get repository by ID
- `GET /repo/user/:userId` - Get user's repositories

### Code Review
- `POST /repo/:id/review` - Add AI review to repository
- `GET /repo/:id/contributions` - Get user contributions

### Issues
- `GET /issue` - Get all issues
- `POST /issue/create` - Create new issue
- `GET /issue/:id` - Get issue by ID

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- CORS configuration for secure cross-origin requests
- Input validation and sanitization
- Protected API endpoints with middleware
- Secure file upload handling

## 🚀 Deployment

The application is designed to be deployed on modern cloud platforms:

- **Frontend**: Deploy to Vercel, Netlify, or similar static hosting
- **Backend**: Deploy to Heroku, Railway, or AWS EC2
- **Database**: MongoDB Atlas for cloud database hosting
- **Storage**: AWS S3 or Supabase Storage for file management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation for common solutions

## 🔮 Future Enhancements

- Real-time collaborative editing
- Advanced AI code suggestions
- Integration with popular IDEs
- Mobile application development
- Advanced analytics and reporting
- Team management and permissions
- CI/CD pipeline integration

---



