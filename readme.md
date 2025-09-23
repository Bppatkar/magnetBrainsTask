# TaskFlow

A comprehensive task management application built with React.js frontend and Node.js backend, featuring user authentication, task CRUD operations, priority management, and modern UI components.

## 🚀 Features

### Core Functionality

- **Task Creation**: Create tasks with title, description, due date, and priority levels
- **Task Management**: View, edit, delete, and update task status
- **Priority Management**: Organize tasks by priority with color-coded lists
- **User Authentication**: Secure login/register system with JWT tokens
- **Task Assignment**: Assign tasks to specific users
- **Pagination & AJAX**: Efficient data loading and display
- **Visual Representation**: Color-coded priority lists for quick identification

### Technical Features

- **RESTful API**: Complete backend API with proper endpoints
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Dynamic task status updates
- **Error Handling**: Comprehensive error management
- **Data Validation**: Input validation on both frontend and backend

## 🛠️ Tech Stack

### Frontend

- **React.js** - UI framework
- **React Router** - Navigation
- **Context API** - State management
- **Axios** - HTTP client
- **CSS3** - Styling

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
/Magnet Brains
├── /client                          # Frontend application
│   ├── /public                      # Static assets
│   ├── /src
│   │   ├── /components              # Reusable components
│   │   │   ├── /ui                  # Base UI components
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   └── Modal.jsx
│   │   │   ├── Layout.jsx           # Main layout wrapper
│   │   │   ├── Navbar.jsx           # Navigation component
│   │   │   ├── TaskForm.jsx         # Task creation/editing form
│   │   │   ├── TaskList.jsx         # Task list display
│   │   │   └── TaskCard.jsx         # Individual task component
│   │   ├── /pages                   # Page components
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── Register.jsx         # Registration page
│   │   │   ├── Dashboard.jsx        # Main dashboard
│   │   │   └── Profile.jsx          # User profile
│   │   ├── /services                # API services
│   │   │   └── api.js               # API configuration
│   │   ├── /context                 # React Context
│   │   │   └── AuthContext.jsx      # Authentication context
│   │   ├── /hooks                   # Custom hooks
│   │   │   └── useAuth.js           # Authentication hook
│   │   ├── /utils                   # Utility functions
│   │   │   └── constants.js         # App constants
│   │   ├── App.jsx                  # Main App component
│   │   ├── main.jsx                 # Entry point
│   │   └── app.css                  # Global styles
├── /server                          # Backend application
│   ├── /config                      # Configuration files
│   │   └── db.js                    # Database connection
│   ├── /controllers                 # Request handlers
│   │   ├── taskController.js        # Task operations
│   │   └── authController.js        # Authentication operations
│   ├── /middleware                  # Custom middleware
│   │   ├── authMiddleware.js        # JWT authentication
│   │   └── errorMiddleware.js       # Error handling
│   ├── /models                      # Database models
│   │   ├── Task.js                  # Task model
│   │   └── User.js                  # User model
│   ├── /routes                      # API routes
│   │   ├── taskRoutes.js            # Task endpoints
│   │   └── authRoutes.js            # Auth endpoints
│   ├── /utils                       # Utility functions
│   │   └── logger.js                # Logging utility
│   ├── .env                         # Environment variables
│   ├── .gitignore                   # Git ignore file
│   ├── package.json                 # Dependencies
│   └── server.js                    # Server entry point
└── README.md                        # Project documentation
```

## 🔧 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/taskmanagement
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 📡 API Endpoints

### Health Check

- `GET /api/healthcheck` - Check server status

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/getProfile` - Get user profile

### User Management

- `GET /api/users/getUsers` - Get all users
- `GET /api/users/getUserById/:id` - Get user by ID
- `PUT /api/users/updateUser/:id` - Update user
- `DELETE /api/users/deleteUser/:id` - Delete user

### Task Management

- `GET /api/tasks/getAllTasks` - Get all tasks with pagination
- `POST /api/tasks/createTask` - Create new task
- `GET /api/tasks/getTaskById/:id` - Get task by ID
- `PUT /api/tasks/updateTaskById/:id` - Update task
- `DELETE /api/tasks/deleteTaskById/:id` - Delete task

## 🎨 Features Implementation

### 1. Task Creation ✅

- Form with title, description, due date fields
- Priority selection (High, Medium, Low)
- Input validation and error handling

### 2. Task List ✅

- Paginated task display
- AJAX-powered updates
- Status indicators (pending, completed)
- Search and filter functionality

### 3. Task Details ✅

- Detailed task view page
- Complete task information display
- Edit/Delete action buttons

### 4. Task Editing ✅

- In-place editing capability
- Form pre-population
- Real-time updates

### 5. Task Deletion ✅

- Confirmation modal dialog
- Safe deletion with user confirmation
- Immediate UI updates

### 6. Task Status Update ✅

- Toggle completion status
- Status change buttons
- Visual status indicators

### 7. User Authentication ✅

- JWT-based authentication
- Protected routes
- User session management
- Role-based access control

### 8. Priority Management ✅

- Drag-and-drop priority lists
- Priority level changes
- Task organization by priority

### 9. Visual Representation ✅

- Color-coded priority lists:
  - 🔴 High Priority (Red)
  - 🟡 Medium Priority (Yellow)
  - 🟢 Low Priority (Green)

## 🧪 Testing

The API has been thoroughly tested using Postman with all endpoints verified for:

- Correct response formats
- Error handling
- Authentication middleware
- Data validation

## 🚀 Deployment

### Backend Deployment

1. Set production environment variables
2. Configure MongoDB Atlas or production database
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment

1. Build the production version:
   ```bash
   npm run build
   ```
2. Deploy to Vercel, Netlify, or similar platforms

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 👨‍💻 Author

**Bhanu Pratap Patkar**

- GitHub: [@Bppatkar](https://github.com/Bppatkar)
- Project Repository: [magnetBrainsTask](https://github.com/Bppatkar/magnetBrainsTask)

## 🙏 Acknowledgments

- Thanks to Magnet Brains for the project requirements
- Built as part of a technical assessment
- Implements modern web development best practices

---

**Happy Task Managing! 🎯**
