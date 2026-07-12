VERIXA SYSTEM ARCHITECTURE

Last Updated: 12 July 2026

Architecture Style

Verixa uses a layered MERN architecture.

React Frontend ↓ Axios API Layer ↓ Express Routes ↓ Authentication
Middleware ↓ Controllers ↓ Services ↓ Mongoose Models ↓ MongoDB Frontend
Architecture

Technology:

React Vite Tailwind CSS React Router Axios Framer Motion Lucide React
Socket.io Client

Main layers:

src/ ├── api/ ├── components/ ├── context/ ├── hooks/ ├── layouts/ ├──
pages/ ├── routes/ └── assets/

Responsibilities:

Pages

Route-level user interfaces.

Examples:

Developer Dashboard Profile Projects Assessments Assessment Player
Certificates Resume Analyzer Recruiter Dashboard Admin Dashboard
Components

Reusable UI elements.

Examples:

Button Card Input Modal Sidebar Navbar ThemeToggle API Layer

Contains Axios calls.

Examples:

authApi userApi projectApi skillAssessmentApi certificateApi Context

Stores global state.

Examples:

AuthContext ThemeContext Routes

Handles public and protected navigation.

AppRoutes.jsx ProtectedRoute.jsx Backend Architecture

Technology:

Node.js Express.js MongoDB Mongoose JWT Socket.io Multer Cloudinary
Nodemailer

Main layers:

backend/src/ ├── config/ ├── controllers/ ├── middleware/ ├── models/
├── routes/ ├── services/ ├── seed/ ├── data/ └── utils/ Route Layer

Routes map requests to controllers.

Example:

POST /api/auth/login ↓ authRoutes.js ↓ login controller

Route files should not contain business logic.

Middleware Layer

Responsibilities:

JWT authentication Role authorization File upload Error handling Request
validation

Examples:

protect authorize upload.single() Controller Layer

Controllers handle:

Request validation Calling services Database operations Sending
responses

Examples:

authController projectController questionController
skillAssessmentController certificateController Service Layer

Services contain reusable business logic.

Examples:

trustScoreService questionGenerator emailService certificate PDF
generator QR generator GitHub service Model Layer

Models define MongoDB schemas.

Examples:

User Project Question AssessmentResult Certificate Notification Message
Authentication Flow Register

↓

Generate OTP

↓

Store OTP

↓

Send Email

↓

Verify Email

↓

Activate Account

↓

Login

↓

JWT

↓

Protected APIs

Current status:

Basic register/login working Email OTP pending Forgot/reset password
pending Forgot Password

↓

Generate Reset Token

↓

Email Reset Link

↓

Reset Password

↓

Password Hash

↓

Login

Refresh Token Architecture

``` text
Protected API
↓
Expired Access Token (401)
↓
Axios Response Interceptor
↓
POST /api/auth/refresh-token
↓
Verify Refresh JWT
↓
Compare Stored SHA-256 Hash
↓
Check Expiry and Password Change
↓
Rotate Refresh Token
↓
Set New HttpOnly Cookie
↓
Return New Access Token
↓
Retry Original API Request
```

The frontend uses concurrent refresh protection so multiple expired API
requests share one refresh operation.

Backend Security Middleware Flow

``` text
Request
↓
Helmet
↓
Global API Rate Limiter
↓
Compression
↓
CORS / Express Middleware
↓
Routes
```

Global API limiter:

``` text
/api
15 minute window
500 requests per IP
```

Strict authentication limiter:

``` text
15 minute window
20 failed authentication requests per IP
Successful requests skipped
```

Compression threshold:

``` text
1024 bytes
```

Skill Assessment Flow Developer profile skills ↓ GET
/api/skill-assessments ↓ Question Bank checks available questions ↓
Assessment cards generated automatically ↓ POST
/api/skill-assessments/start ↓ 15 random questions selected ↓ Correct
answers removed ↓ Assessment Player ↓ Timer + Anti-cheat ↓ POST
/api/skill-assessments/submit ↓ Answers evaluated ↓ AssessmentResult
saved ↓ Trust Score updated ↓ Certificate generated if passed ↓
Dashboard redirect Anti-Cheat Architecture

Frontend detects:

Tab switching Copy Paste Cut Right click F12 DevTools shortcuts
Visibility change

Frontend sends:

{ warnings, antiCheatEvents, timeTaken }

Backend stores anti-cheat metadata with result.

Question Generation Architecture questionLibrary.js ↓
questionGenerator.js ↓ questionSeed.js ↓ MongoDB Question Collection

Seed command:

npm run seed:questions Trust Score Architecture

Trust Score uses:

Profile completeness Verified projects Assessment results GitHub score

Flow:

Assessment submitted ↓ calculateTrustScore(userId) ↓ User trustScore
updated ↓ Dashboard reflects latest value Certificate Architecture

Planned flow:

Passed AssessmentResult ↓ Generate unique Certificate ID ↓ Create public
verification URL ↓ Generate QR code ↓ Generate PDF ↓ Save Certificate ↓
Developer downloads PDF ↓ Recruiter verifies certificate publicly
Socket.io Architecture Frontend Socket Client ↓ Socket.io Server ↓
Online User Map ↓ Send and Receive Events

Main events:

join online-users send-message receive-message typing stop-typing
disconnect Deployment Architecture

Planned production stack:

Frontend → Vercel Backend → Render or Railway Database → MongoDB Atlas
Media → Cloudinary Email → Gmail SMTP or Resend Security Rules Passwords
must be hashed. JWT secrets must remain in environment variables.
Correct assessment answers must never be returned to frontend. Admin
routes must use role authorization. File uploads must validate file size
and type. OTP values should be hashed before storage. Public certificate
verification must not expose private user data. CORS must allow only
trusted frontend origins in production. .env must never be committed.
