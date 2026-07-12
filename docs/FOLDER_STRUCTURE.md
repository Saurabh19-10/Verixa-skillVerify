VERIXA FOLDER STRUCTURE

Last Updated: 12 July 2026

Project Root Verixa2/ │ ├── backend/ ├── docs/ ├── node_modules/ ├──
public/ ├── src/ │ ├── .env ├── .gitignore ├── package.json ├──
package-lock.json ├── vite.config.js ├── index.html └── README.md
Documentation docs/ ├── PROJECT_CONTEXT.md ├── PROJECT_STATUS.md ├──
NEXT_TASKS.md ├── API_DOCUMENTATION.md ├── DATABASE_SCHEMA.md ├──
ARCHITECTURE.md ├── CHANGELOG.md └── FOLDER_STRUCTURE.md Frontend
Structure src/ │ ├── api/ │ ├── api.js │ ├── authApi.js │ ├── userApi.js
│ ├── projectApi.js │ ├── skillAssessmentApi.js │ ├── certificateApi.js
│ ├── notificationApi.js │ └── resumeApi.js │ ├── assets/ │ ├──
verixa-icon.png │ └── images/ │ ├── components/ │ ├── common/ │ │ ├──
ThemeToggle.jsx │ │ └── UserDropdown.jsx │ │ │ ├── layout/ │ │ ├──
Sidebar.jsx │ │ ├── Navbar.jsx │ │ └── DashboardTopbar.jsx │ │ │ └── ui/
│ ├── Button.jsx │ ├── Card.jsx │ ├── Input.jsx │ ├── Badge.jsx │ ├──
Modal.jsx │ └── Loader.jsx │ ├── context/ │ ├── AuthContext.jsx │ └──
ThemeContext.jsx │ ├── hooks/ │ ├── useAuth.js │ └── useTheme.js │ ├──
layouts/ │ └── DashboardLayout.jsx │ ├── pages/ │ ├── Auth/ │ │ ├──
Login.jsx │ │ ├── Register.jsx │ │ └── OAuthSuccess.jsx │ │ │ ├──
Developer/ │ │ ├── Dashboard.jsx │ │ ├── Profile.jsx │ │ ├──
Projects.jsx │ │ ├── Assessments.jsx │ │ ├── AssessmentPlayer.jsx │ │
├── Certificates.jsx │ │ ├── Verification.jsx │ │ ├── AIReview.jsx │ │
└── ResumeAnalyzer.jsx │ │ │ ├── Recruiter/ │ │ ├── Dashboard.jsx │ │
├── Profile.jsx │ │ ├── SearchDevelopers.jsx │ │ ├──
DeveloperDetails.jsx │ │ ├── CompareDevelopers.jsx │ │ ├──
ShortlistedCandidates.jsx │ │ └── Reports.jsx │ │ │ ├── Admin/ │ │ ├──
AdminDashboard.jsx │ │ └── Questions.jsx │ │ │ ├── Public/ │ │ └──
CertificateVerification.jsx │ │ │ ├── Chat/ │ │ └── Chat.jsx │ │ │ ├──
HomePage.jsx │ └── NotFound.jsx │ ├── routes/ │ ├── AppRoutes.jsx │ └──
ProtectedRoute.jsx │ ├── App.jsx ├── main.jsx └── index.css Backend
Structure backend/ │ ├── node_modules/ ├── uploads/ ├── .env ├──
package.json ├── package-lock.json │ └── src/ │ ├── config/ │ ├── db.js
│ ├── cloudinary.js │ └── passport.js │ ├── controllers/ │ ├──
authController.js │ ├── userController.js │ ├── projectController.js │
├── questionController.js │ ├── skillAssessmentController.js │ ├──
certificateController.js │ ├── notificationController.js │ ├──
resumeController.js │ ├── chatController.js │ └── adminController.js \|
\|----passwordcontroller.js │ ├── data/ │ ├── questionLibrary.js │ └──
skillMapping.js │ ├── middleware/ │ ├── authMiddleware.js │ ├──
rateLimiters.js │ ├── uploadMiddleware.js │ └── errorMiddleware.js │ ├──
models/ │ ├── User.js │ ├── Project.js │ ├── Question.js │ ├──
AssessmentResult.js │ ├── Certificate.js │ ├── Notification.js │ └──
Message.js │ ├── routes/ │ ├── authRoutes.js │ ├── userRoutes.js │ ├──
projectRoutes.js │ ├── questionRoutes.js │ ├── skillAssessmentRoutes.js
│ ├── certificateRoutes.js │ ├── notificationRoutes.js │ ├──
resumeRoutes.js │ ├── chatRoutes.js │ └── adminRoutes.js │ ├── seed/ │
├── adminSeed.js │ └── questionSeed.js │ ├── services/ │ ├──
trustScoreService.js │ ├── questionGenerator.js │ ├── emailService.js │
├── githubService.js │ ├── pdfGenerator.js │ └── qrGenerator.js │ ├──
utils/ │ ├── generateToken.js │ └── generateOTP.js │ ├── app.js └──
server.js Deprecated Files

These files should not be used:

backend/src/models/Assessment.js
backend/src/controllers/assessmentController.js
backend/src/routes/assessmentRoutes.js

The current assessment system uses:

skillAssessmentController.js skillAssessmentRoutes.js
AssessmentResult.js Question.js Important Commands

Frontend:

npm install npm run dev npm run build

Backend:

cd backend npm install npm run dev npm start npm run seed:questions

MongoDB:

mongosh use verixa Important Ports Frontend: 5173 Backend: 5050 MongoDB:
27017 Folder Maintenance Rules API calls belong inside src/api. Route
pages belong inside src/pages. Reusable UI belongs inside
src/components. Database schemas belong inside backend/src/models.
Business logic belongs inside backend/src/services. Request handlers
belong inside backend/src/controllers. Route definitions belong inside
backend/src/routes. Seed scripts belong inside backend/src/seed.
Documentation belongs inside docs. Secrets belong only inside .env.

# BACKEND SECURITY LOCATIONS

``` text
backend/src/app.js
├── Helmet
├── Global API Rate Limiter
├── Compression
└── CORS
```

``` text
backend/src/middleware/rateLimiters.js
├── apiLimiter
└── authLimiter
```

``` text
backend/src/controllers/authController.js
├── Refresh session creation
├── Refresh token rotation
└── Logout session invalidation
```

``` text
backend/src/models/User.js
├── refreshToken
└── refreshTokenExpires
```

``` text
src/api/api.js
├── Access token attachment
├── Automatic refresh
├── Failed request retry
└── Concurrent refresh protection
```
