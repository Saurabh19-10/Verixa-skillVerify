# VERIXA API DOCUMENTATION

**Project:** Verixa **Tagline:** Proof of Skills, Not Just Claims
**Backend:** Node.js, Express.js, MongoDB, Mongoose **Authentication:**
JWT Access Token + Rotating Refresh Token **Default Development URL:**
`http://localhost:5050`

------------------------------------------------------------------------

# 1. API BASE URL

All API endpoints use the following base URL during local development:

``` text
http://localhost:5050/api
```

Example:

``` text
POST http://localhost:5050/api/auth/login
```

------------------------------------------------------------------------

# 2. STANDARD RESPONSE FORMAT

## Success response

``` json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

Some existing endpoints may return named properties instead of `data`.

Example:

``` json
{
  "success": true,
  "tests": []
}
```

## Error response

``` json
{
  "success": false,
  "message": "Error message"
}
```

------------------------------------------------------------------------

# 3. AUTHENTICATION

Protected APIs require a JWT token.

Include it in the request header:

``` http
Authorization: Bearer YOUR_JWT_TOKEN
```

Example:

``` bash
curl http://localhost:5050/api/skill-assessments \
-H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Verify Email

POST /api/auth/verify-email

Body

{ "email": "user@example.com", "otp": "123456" } \## Resend Verification
OTP

POST /api/auth/resend-verification-otp

Body

{ "email":"user@example.com" } \## Forgot Password

POST /api/auth/forgot-password

Body

{ "email":"user@example.com" } \## Reset Password

POST /api/auth/reset-password/:token

Body

{ "password":"NewPassword123" } ---

## 3.1 Refresh Token Session

The current authentication flow uses:

``` text
Short-lived Access Token
+
Rotating Refresh Token
```

Access token storage key:

``` text
verixa_token
```

Refresh token cookie:

``` text
verixa_refresh_token
```

The refresh token cookie is HttpOnly and cannot be read using
`document.cookie`.

Refresh tokens are SHA-256 hashed before storage in MongoDB.

When an access token expires, the shared Axios client calls:

``` http
POST /api/auth/refresh-token
```

After a successful refresh, the refresh token is rotated, the new access
token is stored, and the original protected API request is retried.

Concurrent `401` responses share one refresh request.

------------------------------------------------------------------------

# 4. USER ROLES

Verixa supports three roles:

``` text
developer
recruiter
admin
```

Role-based middleware protects restricted routes.

Example:

``` js
protect
authorize("admin")
```

## authentication status: completed

# 5. AUTHENTICATION API

Base route:

``` text
/api/auth
```

------------------------------------------------------------------------

## 5.1 Register User

``` http
POST /api/auth/register
```

### Access

Public

### Request body

``` json
{
  "name": "Saurabh Rai",
  "email": "saurabh@example.com",
  "password": "StrongPassword123",
  "role": "developer"
}
```

### Success response

``` json
{
  "success": true,
  "message": "User registered successfully",
  "token": "JWT_TOKEN",
  "user": {
    "id": "USER_ID",
    "name": "Saurabh Rai",
    "email": "saurabh@example.com",
    "role": "developer"
  }
}
```

### Current limitation

Email ownership is not yet fully verified.

### Planned flow

``` text
Register
→ Send OTP
→ Verify OTP
→ Allow Login
```

------------------------------------------------------------------------

## 5.2 Login User

``` http
POST /api/auth/login
```

### Access

Public

### Request body

``` json
{
  "email": "saurabh@example.com",
  "password": "StrongPassword123"
}
```

### Success response

``` json
{
  "success": true,
  "token": "JWT_TOKEN",
  "user": {
    "id": "USER_ID",
    "name": "Saurabh Rai",
    "email": "saurabh@example.com",
    "role": "developer",
    "skills": []
  }
}
```

### Error response

``` json
{
  "success": false,
  "message": "Invalid email or password"
}
```

------------------------------------------------------------------------

## 5.3 Google OAuth

The project contains Google OAuth support.

Possible routes may include:

``` text
GET /api/auth/google
GET /api/auth/google/callback
```

Frontend callback route:

``` text
/oauth-success
```

Confirm the exact backend paths in:

``` text
backend/src/routes/authRoutes.js
```

------------------------------------------------------------------------

## 5.4 GitHub OAuth

The project may contain GitHub OAuth dependencies.

Possible routes:

``` text
GET /api/auth/github
GET /api/auth/github/callback
```

Confirm whether these routes are currently enabled.

------------------------------------------------------------------------

## 5.5 Logout

Logout is mainly handled on the frontend by removing the saved JWT
token.

Frontend storage key:

``` text
verixa_token
```

Possible future backend route:

``` http
POST /api/auth/logout
```

------------------------------------------------------------------------

## 5.6 Email OTP Verification

Status:

``` text
Pending
```

Planned routes:

``` http
POST /api/auth/send-verification-otp
POST /api/auth/verify-email
POST /api/auth/resend-verification-otp
```

Example verify request:

``` json
{
  "email": "saurabh@example.com",
  "otp": "482193"
}
```

------------------------------------------------------------------------

## 5.7 Forgot Password

Status:

``` text
Pending
```

Planned route:

``` http
POST /api/auth/forgot-password
```

Request:

``` json
{
  "email": "saurabh@example.com"
}
```

------------------------------------------------------------------------

## 5.8 Reset Password

Status:

``` text
Pending
```

Planned route:

``` http
POST /api/auth/reset-password
```

Request:

``` json
{
  "token": "RESET_TOKEN",
  "password": "NewStrongPassword123"
}
```

------------------------------------------------------------------------

## 5.9 Change Password

Status:

``` text
Pending
```

Planned route:

``` http
PUT /api/auth/change-password
```

Request:

``` json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
```

------------------------------------------------------------------------

## 5.10 Refresh Access Token

``` http
POST /api/auth/refresh-token
```

### Access

Refresh cookie required

### Success Response

``` json
{
  "success": true,
  "message": "Access token refreshed successfully",
  "token": "NEW_ACCESS_TOKEN"
}
```

### Security Flow

``` text
Read HttpOnly Refresh Cookie
↓
Verify JWT with JWT_REFRESH_SECRET
↓
Validate Refresh Token Type
↓
Compare SHA-256 Token Hash
↓
Check Refresh Expiry
↓
Check Password Change Time
↓
Rotate Refresh Token
↓
Return New Access Token
```

Refresh token reuse invalidates the stored refresh session.

------------------------------------------------------------------------

# 6. USER PROFILE API

The exact route prefix should be confirmed from the user route file.

Likely base route:

``` text
/api/users
```

or:

``` text
/api/user
```

------------------------------------------------------------------------

## 6.1 Get Logged-in User Profile

Possible route:

``` http
GET /api/users/profile
```

### Access

Protected

### Response

``` json
{
  "success": true,
  "user": {
    "_id": "USER_ID",
    "name": "Saurabh Rai",
    "email": "saurabh@example.com",
    "role": "developer",
    "title": "MERN Stack Developer",
    "bio": "Developer bio",
    "skills": [
      "Java",
      "React",
      "MongoDB"
    ],
    "github": "https://github.com/username",
    "portfolio": "https://portfolio.example.com",
    "avatar": "",
    "trustScore": 75,
    "githubScore": 60
  }
}
```

------------------------------------------------------------------------

## 6.2 Update Profile

Possible route:

``` http
PUT /api/users/profile
```

### Access

Protected

### Request

``` json
{
  "name": "Saurabh Rai",
  "title": "Full Stack Developer",
  "bio": "MERN developer",
  "skills": [
    "Java",
    "React",
    "MongoDB"
  ],
  "github": "https://github.com/username",
  "portfolio": "https://portfolio.example.com"
}
```

------------------------------------------------------------------------

## 6.3 Upload Avatar

Possible route:

``` http
POST /api/users/avatar
```

### Content type

``` text
multipart/form-data
```

Possible file key:

``` text
avatar
```

------------------------------------------------------------------------

## 6.4 Upload Resume

Possible route:

``` http
POST /api/users/resume
```

### Content type

``` text
multipart/form-data
```

Possible file key:

``` text
resume
```

------------------------------------------------------------------------

# 7. PROJECT API

Likely base route:

``` text
/api/projects
```

------------------------------------------------------------------------

## 7.1 Get User Projects

``` http
GET /api/projects
```

### Access

Protected

### Response

``` json
{
  "success": true,
  "count": 2,
  "projects": [
    {
      "_id": "PROJECT_ID",
      "title": "Verixa",
      "description": "Developer verification platform",
      "technologies": [
        "React",
        "Node.js",
        "MongoDB"
      ],
      "githubUrl": "https://github.com/example/verixa",
      "liveUrl": "https://verixa.example.com",
      "status": "Pending"
    }
  ]
}
```

------------------------------------------------------------------------

## 7.2 Create Project

``` http
POST /api/projects
```

### Access

Developer

### Request

``` json
{
  "title": "Verixa",
  "description": "Proof-based developer platform",
  "technologies": [
    "React",
    "Node.js",
    "MongoDB"
  ],
  "githubUrl": "https://github.com/example/verixa",
  "liveUrl": "https://verixa.example.com"
}
```

------------------------------------------------------------------------

## 7.3 Get Project by ID

``` http
GET /api/projects/:id
```

------------------------------------------------------------------------

## 7.4 Update Project

``` http
PUT /api/projects/:id
```

### Access

Project owner or admin

------------------------------------------------------------------------

## 7.5 Delete Project

``` http
DELETE /api/projects/:id
```

### Access

Project owner or admin

------------------------------------------------------------------------

## 7.6 Verify Project

Possible route:

``` http
PATCH /api/projects/:id/verify
```

### Access

Admin

### Possible response

``` json
{
  "success": true,
  "message": "Project verified successfully",
  "project": {
    "_id": "PROJECT_ID",
    "status": "Verified"
  }
}
```

Confirm the exact verification route in:

``` text
backend/src/routes/projectRoutes.js
```

------------------------------------------------------------------------

# 8. QUESTION BANK API

Base route:

``` text
/api/questions
```

Most routes are restricted to admin users.

------------------------------------------------------------------------

## 8.1 Get Questions

``` http
GET /api/questions
```

### Access

Admin

### Query parameters

``` text
skill
difficulty
search
```

Example:

``` text
GET /api/questions?skill=Java&difficulty=Easy
```

### Response

``` json
{
  "success": true,
  "count": 15,
  "questions": []
}
```

------------------------------------------------------------------------

## 8.2 Get Question by ID

``` http
GET /api/questions/:id
```

### Access

Admin

------------------------------------------------------------------------

## 8.3 Create Question

``` http
POST /api/questions
```

### Access

Admin

### Request

``` json
{
  "skill": "Java",
  "category": "Programming",
  "difficulty": "Easy",
  "question": "Which keyword is used to inherit a class in Java?",
  "options": [
    "extends",
    "implements",
    "inherits",
    "super"
  ],
  "correctAnswer": "extends",
  "explanation": "The extends keyword is used for class inheritance."
}
```

### Validation

-   Exactly four options are required.
-   `correctAnswer` must be one of the options.
-   Difficulty must be `Easy`, `Medium`, or `Hard`.

------------------------------------------------------------------------

## 8.4 Update Question

``` http
PUT /api/questions/:id
```

### Access

Admin

------------------------------------------------------------------------

## 8.5 Delete Question

``` http
DELETE /api/questions/:id
```

### Access

Admin

------------------------------------------------------------------------

## 8.6 Question Statistics

``` http
GET /api/questions/stats
```

### Access

Admin

### Response

``` json
{
  "success": true,
  "stats": {
    "totalQuestions": 165,
    "activeQuestions": 165,
    "inactiveQuestions": 0,
    "bySkill": [
      {
        "_id": "Java",
        "count": 15
      }
    ],
    "byDifficulty": [
      {
        "_id": "Easy",
        "count": 55
      }
    ]
  }
}
```

------------------------------------------------------------------------

## 8.7 Import Questions

``` http
POST /api/questions/import
```

### Access

Admin

### Content type

``` text
multipart/form-data
```

### File field

``` text
file
```

### Supported formats

``` text
.csv
.xlsx
.xls
```

### Required columns

``` text
skill
category
difficulty
question
option1
option2
option3
option4
correctAnswer
explanation
```

### Response

``` json
{
  "success": true,
  "message": "Questions imported successfully",
  "totalRows": 100,
  "insertedCount": 96,
  "invalidCount": 4,
  "invalidRows": []
}
```

------------------------------------------------------------------------

# 9. SKILL ASSESSMENT API

Base route:

``` text
/api/skill-assessments
```

This is the current assessment system.

The old manual Assessment model and old `/api/assessments` flow are
deprecated.

------------------------------------------------------------------------

## 9.1 Get Available Assessments

``` http
GET /api/skill-assessments
```

### Access

Developer

### Description

Returns tests based on the logged-in developer's skills.

A test appears only when at least 15 active questions exist for that
skill.

### Response

``` json
{
  "success": true,
  "tests": [
    {
      "skill": "Java",
      "totalQuestions": 15,
      "duration": 30,
      "passingPercentage": 70,
      "availableQuestions": 15
    }
  ]
}
```

------------------------------------------------------------------------

## 9.2 Start Skill Assessment

``` http
POST /api/skill-assessments/start
```

### Access

Developer

### Request

``` json
{
  "skill": "Java"
}
```

### Response

``` json
{
  "success": true,
  "assessment": {
    "skill": "Java",
    "duration": 30,
    "totalQuestions": 15,
    "passingPercentage": 70,
    "questions": [
      {
        "_id": "QUESTION_ID",
        "question": "Question text",
        "options": [
          "Option A",
          "Option B",
          "Option C",
          "Option D"
        ],
        "difficulty": "Easy"
      }
    ]
  }
}
```

### Security

The response does not expose:

``` text
correctAnswer
explanation
```

------------------------------------------------------------------------

## 9.3 Submit Skill Assessment

``` http
POST /api/skill-assessments/submit
```

### Access

Developer

### Request

``` json
{
  "skill": "Java",
  "answers": [
    {
      "questionId": "QUESTION_ID",
      "question": "Question text",
      "selectedAnswer": "Selected option"
    }
  ],
  "warnings": 1,
  "antiCheatEvents": [
    {
      "type": "TAB_SWITCH",
      "message": "Tab switch detected"
    }
  ],
  "timeTaken": 900
}
```

### Rules

-   Exactly 15 answers must be submitted.
-   Passing percentage is 70%.
-   Result is stored in `AssessmentResult`.
-   Trust Score is recalculated.
-   Notification is created.
-   Certificate generation is attempted when the user passes.

### Response

``` json
{
  "success": true,
  "message": "Assessment submitted successfully",
  "result": {
    "_id": "RESULT_ID",
    "skill": "Java",
    "score": 12,
    "totalQuestions": 15,
    "percentage": 80,
    "passed": true,
    "attemptNumber": 1,
    "warnings": 1
  },
  "certificate": null
}
```

Certificate may remain `null` until the certificate controller is fully
updated for the skill-based architecture.

------------------------------------------------------------------------

## 9.4 Get My Assessment Results

``` http
GET /api/skill-assessments/my-results
```

### Access

Developer

### Response

``` json
{
  "success": true,
  "count": 2,
  "results": [
    {
      "_id": "RESULT_ID",
      "skill": "Java",
      "score": 12,
      "totalQuestions": 15,
      "percentage": 80,
      "passed": true,
      "attemptNumber": 1,
      "warnings": 0,
      "createdAt": "2026-07-11T10:00:00.000Z"
    }
  ]
}
```

------------------------------------------------------------------------

# 10. ASSESSMENT ANTI-CHEAT

Anti-cheat is primarily enforced by the frontend assessment player.

Currently monitored actions include:

``` text
Tab switch
Window visibility change
Copy
Paste
Cut
Right click
F12
Ctrl + U
Ctrl + Shift + I
Ctrl + Shift + J
Ctrl + Shift + C
Command-based equivalents on macOS
```

Maximum warning limit:

``` text
3
```

On the third warning, the assessment may be auto-submitted.

Anti-cheat metadata is sent to:

``` http
POST /api/skill-assessments/submit
```

------------------------------------------------------------------------

# 11. CERTIFICATE API

Base route:

``` text
/api/certificates
```

Status:

``` text
In Progress
```

------------------------------------------------------------------------

## 11.1 Get My Certificates

``` http
GET /api/certificates/my
```

### Access

Developer

### Response

``` json
{
  "success": true,
  "count": 1,
  "certificates": [
    {
      "_id": "CERTIFICATE_ID",
      "certificateId": "VERIXA-ABCD1234",
      "skill": "Java",
      "score": 12,
      "percentage": 80,
      "issuedAt": "2026-07-11T10:00:00.000Z",
      "qrCode": "data:image/png;base64,...",
      "pdfUrl": "/uploads/certificates/VERIXA-ABCD1234.pdf"
    }
  ]
}
```

------------------------------------------------------------------------

## 11.2 Verify Certificate

``` http
GET /api/certificates/verify/:certificateId
```

### Access

Public

### Example

``` text
GET /api/certificates/verify/VERIXA-ABCD1234
```

### Response

``` json
{
  "success": true,
  "certificate": {
    "certificateId": "VERIXA-ABCD1234",
    "skill": "Java",
    "score": 12,
    "percentage": 80,
    "issuedAt": "2026-07-11T10:00:00.000Z",
    "user": {
      "name": "Saurabh Rai",
      "title": "MERN Stack Developer"
    }
  }
}
```

------------------------------------------------------------------------

## 11.3 Certificate PDF

Static files are served through:

``` text
/uploads
```

Example:

``` text
http://localhost:5050/uploads/certificates/VERIXA-ABCD1234.pdf
```

Expected backend configuration:

``` js
app.use("/uploads", express.static("uploads"));
```

------------------------------------------------------------------------

# 12. TRUST SCORE API

Trust Score currently updates internally through:

``` text
backend/src/services/trustScoreService.js
```

It is recalculated after assessment submission.

Current factors may include:

``` text
Profile completeness
Verified projects
Best assessment scores
GitHub score
```

There may not yet be a dedicated public endpoint.

Possible future route:

``` http
GET /api/users/trust-score
```

------------------------------------------------------------------------

# 13. RESUME ANALYZER API

The project contains a Resume Analyzer module.

Exact endpoints must be confirmed from the relevant route file.

Likely routes:

``` http
POST /api/resume/upload
POST /api/resume/analyze
GET /api/resume/result
```

Possible content type:

``` text
multipart/form-data
```

Possible file key:

``` text
resume
```

Current status:

``` text
Working, but ATS scoring and advanced suggestions need improvement.
```

------------------------------------------------------------------------

# 14. AI REVIEW API

Possible base route:

``` text
/api/ai-review
```

Frontend functions currently include:

``` text
getAIReview()
generateAIReview()
```

Likely routes:

``` http
GET /api/ai-review
POST /api/ai-review/generate
```

Confirm exact paths in:

``` text
src/api/aiApi.js
backend/src/routes/
```

------------------------------------------------------------------------

# 15. NOTIFICATION API

Assessment completion creates notifications internally.

Possible routes:

``` http
GET /api/notifications
PATCH /api/notifications/:id/read
DELETE /api/notifications/:id
```

Confirm exact route definitions in:

``` text
backend/src/routes/notificationRoutes.js
```

------------------------------------------------------------------------

# 16. CHAT API

Real-time chat uses Socket.io.

Socket server runs on:

``` text
http://localhost:5050
```

------------------------------------------------------------------------

## Socket Events

### Connect

``` text
connection
```

### Join user

Client emits:

``` text
join
```

Payload:

``` text
USER_ID
```

------------------------------------------------------------------------

### Online users

Server emits:

``` text
online-users
```

Payload:

``` json
[
  "USER_ID_1",
  "USER_ID_2"
]
```

------------------------------------------------------------------------

### Send message

Client emits:

``` text
send-message
```

Payload:

``` json
{
  "sender": "SENDER_ID",
  "receiver": "RECEIVER_ID",
  "message": "Hello"
}
```

------------------------------------------------------------------------

### Receive message

Server emits:

``` text
receive-message
```

------------------------------------------------------------------------

### Typing

Client emits:

``` text
typing
```

Payload:

``` json
{
  "sender": "SENDER_ID",
  "receiver": "RECEIVER_ID"
}
```

Server emits:

``` text
typing
```

------------------------------------------------------------------------

### Stop typing

Client emits:

``` text
stop-typing
```

Server emits:

``` text
stop-typing
```

------------------------------------------------------------------------

### Disconnect

``` text
disconnect
```

------------------------------------------------------------------------

# 17. ADMIN API

Likely base route:

``` text
/api/admin
```

------------------------------------------------------------------------

## 17.1 Admin Dashboard Statistics

Possible route:

``` http
GET /api/admin/dashboard
```

### Access

Admin

### Possible response

``` json
{
  "success": true,
  "stats": {
    "totalUsers": 100,
    "totalDevelopers": 70,
    "totalRecruiters": 20,
    "totalProjects": 40,
    "totalResults": 90,
    "totalAssessments": 11
  }
}
```

`totalAssessments` now represents supported skill tests or active
question-bank skills because the old Assessment model was removed.

------------------------------------------------------------------------

## 17.2 Get All Users

Possible route:

``` http
GET /api/admin/users
```

### Access

Admin

------------------------------------------------------------------------

## 17.3 Update User Role or Status

Possible routes:

``` http
PATCH /api/admin/users/:id
DELETE /api/admin/users/:id
```

Confirm exact paths in:

``` text
backend/src/routes/adminRoutes.js
```

------------------------------------------------------------------------

# 18. RECRUITER API

Recruiter frontend currently contains:

``` text
Dashboard
Search Developers
Developer Details
Compare Developers
Shortlist
Reports
Profile
```

Possible route groups:

``` text
/api/recruiters
/api/developers
/api/shortlists
/api/reports
```

Exact paths must be confirmed from backend route files.

------------------------------------------------------------------------

## 18.1 Search Developers

Possible route:

``` http
GET /api/recruiters/developers
```

Possible query parameters:

``` text
skill
trustScore
title
search
```

Example:

``` text
GET /api/recruiters/developers?skill=React&trustScore=70
```

------------------------------------------------------------------------

## 18.2 Get Developer Details

Possible route:

``` http
GET /api/recruiters/developers/:id
```

------------------------------------------------------------------------

## 18.3 Shortlist Developer

Possible route:

``` http
POST /api/recruiters/shortlist/:developerId
```

------------------------------------------------------------------------

## 18.4 Remove from Shortlist

Possible route:

``` http
DELETE /api/recruiters/shortlist/:developerId
```

------------------------------------------------------------------------

# 19. HEALTH CHECK API

Recommended routes:

``` http
GET /
GET /api/health
```

Example response:

``` json
{
  "success": true,
  "message": "Verixa API is running"
}
```

------------------------------------------------------------------------

# 20. COMMON HTTP STATUS CODES

  Status   Meaning
  -------- ------------------------------------------
  `200`    Request completed successfully
  `201`    Resource created successfully
  `400`    Validation or bad request error
  `401`    Authentication required or invalid token
  `403`    Authenticated but not authorized
  `404`    Resource not found
  `409`    Duplicate resource or conflict
  `500`    Internal server error

------------------------------------------------------------------------

# 21. COMMON ERRORS

## Missing token

``` json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

## Invalid token

``` json
{
  "success": false,
  "message": "Not authorized, token failed"
}
```

## Forbidden role

``` json
{
  "success": false,
  "message": "Role is not authorized to access this route"
}
```

## Validation error

``` json
{
  "success": false,
  "message": "Required fields are missing"
}
```

## Resource not found

``` json
{
  "success": false,
  "message": "Resource not found"
}
```

------------------------------------------------------------------------

# 22. DEPRECATED APIs

The old manual assessment system has been replaced.

Deprecated route group:

``` text
/api/assessments
```

Deprecated backend files:

``` text
backend/src/models/Assessment.js
backend/src/controllers/assessmentController.js
backend/src/routes/assessmentRoutes.js
```

Current assessment route group:

``` text
/api/skill-assessments
```

Do not reintroduce the old Assessment model unless the architecture is
intentionally redesigned.

------------------------------------------------------------------------

# 23. FRONTEND API STORAGE

JWT token key:

``` text
verixa_token
```

Example Axios interceptor:

``` js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("verixa_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
```

------------------------------------------------------------------------

# 24. ENVIRONMENT VARIABLES

Typical backend `.env` file:

``` env
PORT=5050
MONGO_URI=mongodb://127.0.0.1:27017/verixa
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRE=7d
CLIENT_URL=http://localhost:5173

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_CALLBACK_URL=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

EMAIL_USER=
EMAIL_PASSWORD=
```

Never commit real secret values to GitHub.

------------------------------------------------------------------------

# 25. API TESTING

Recommended tools:

``` text
Postman
Thunder Client
curl
Browser DevTools Network tab
```

Example login test:

``` bash
curl -X POST http://127.0.0.1:5050/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "saurabh@example.com",
  "password": "StrongPassword123"
}'
```

Example skill-assessment test:

``` bash
curl http://127.0.0.1:5050/api/skill-assessments \
-H "Authorization: Bearer YOUR_TOKEN"
```

------------------------------------------------------------------------

# 26. CURRENT API PRIORITIES

## Highest priority

-   Email OTP verification
-   Forgot password
-   Reset password
-   Change password
-   Complete skill-based certificate generation
-   Certificate verification
-   GitHub verification

## Medium priority

-   Recruiter search improvements
-   Admin analytics
-   Resume ATS enhancement
-   Trust Score enhancement

## Final phase

-   API testing
-   Security review
-   Deployment
-   Production environment variables
-   MongoDB Atlas migration

------------------------------------------------------------------------

# 26.1 BACKEND SECURITY HARDENING

## Helmet

Status:

``` text
Completed
```

Helmet security headers are enabled globally.

Current resource policy:

``` text
Cross-Origin-Resource-Policy: cross-origin
```

This preserves cross-origin access to backend-served upload assets.

## Global API Rate Limiting

Status:

``` text
Completed
```

Scope:

``` text
/api
```

Configuration:

``` text
15 minute window
500 requests per IP
```

Rate-limit rejection:

``` text
429 Too Many Requests
```

## Strict Authentication Rate Limiting

Status:

``` text
Completed
```

Sensitive public authentication routes use:

``` text
15 minute window
20 failed authentication requests per IP
Successful requests are skipped
```

The refresh-token endpoint remains protected by the global API limiter
and is not attached to the strict authentication limiter.

## Response Compression

Status:

``` text
Completed
```

Compression is enabled with:

``` text
threshold: 1024 bytes
```

Eligible responses are compressed when supported by the client.

## Pending Security Documentation

``` text
Swagger Documentation
```

------------------------------------------------------------------------

# 27. MAINTENANCE NOTE

Whenever an endpoint is added, changed, or removed:

1.  Update this document.
2.  Update `PROJECT_STATUS.md`.
3.  Update `NEXT_TASKS.md`.
4.  Add the change to `CHANGELOG.md`.
5.  Verify the endpoint with Postman or curl.
6.  Confirm that the frontend API function uses the same route.

------------------------------------------------------------------------

# CURRENT TASK

``` text
Authentication Email OTP Verification
```

After authentication completion:

``` text
Certificate Module
→ GitHub Verification
→ Testing
→ Deployment
```
