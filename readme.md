/Magnet Brains
├── /client
│ ├── /public
│ ├── /src
├── components/
│ ├── ui/ # shadcnUI components
│ ├── Layout.jsx # Main layout
│ ├── Navbar.jsx # Navigation
│ ├── TaskForm.jsx # Create/Edit task form
│ ├── TaskList.jsx # Task listing
│ └── TaskCard.jsx # Individual task card
├── pages/
│ ├── Login.jsx # Login page
│ ├── Register.jsx # Register page
│ ├── Dashboard.jsx # Main dashboard
│ └── Profile.jsx # User profile
├── services/
│ └── api.js # API calls
├── context/
│ └── AuthContext.jsx # Authentication context
├── hooks/
│ └── useAuth.js # Authentication hook
└── utils/
└── constants.js # Constants
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ └── app.css
├── /server
│ ├── /config
│ │ └── db.js
│ ├── /controllers
│ │ ├── taskController.js
│ │ └── authController.js
│ ├── /middleware
│ │ └── authMiddleware.js
│ │ └── errorMiddeware.js
│ ├── /models
│ │ ├── Task.js
│ │ └── User.js
│ ├── /routes
│ │ ├── taskRoutes.js
│ │ └── authRoutes.js
│ ├── /utils
│ │ └── logger.js
│ ├── .env
│ ├── .gitignore
│ ├── package.json
│ └── server.js
└── README.md
