VERIXA DATABASE SCHEMA

Last Updated: 12 July 2026

Database

Verixa uses:

MongoDB Mongoose ODM

Local database:

mongodb://127.0.0.1:27017/verixa User Model Authentication Fields

isEmailVerified: Boolean

emailVerificationOTP: String

emailVerificationExpires: Date

passwordResetToken: String

passwordResetExpires: Date

Collection:

users

Purpose:

Stores developer, recruiter and admin accounts.

Main fields:

{ name: String, email: String, password: String, role: "developer" \|
"recruiter" \| "admin",

title: String, bio: String, skills: \[String\],

github: String, portfolio: String, avatar: String, resume: String,

trustScore: Number, githubScore: Number,

isEmailVerified: Boolean,

createdAt: Date, updatedAt: Date }

Planned authentication fields:

{ emailVerificationOTP: String, emailVerificationExpires: Date,

passwordResetToken: String, passwordResetExpires: Date,

refreshToken: String }

Authentication Storage Rules

``` text
password → bcrypt hash
emailVerificationOTP → hashed value
passwordResetToken → SHA-256 hash
refreshToken → SHA-256 hash
```

Refresh token fields are now active in the production authentication
flow.

``` text
refreshToken
refreshTokenExpires
```

The raw refresh JWT is never stored in MongoDB.

Password changes invalidate the current refresh session.

Indexes:

email: unique Project Model

Collection:

projects

Purpose:

Stores developer projects.

Main fields:

{ user: ObjectId, title: String, description: String,

technologies: \[String\],

githubUrl: String, liveUrl: String,

status: "Pending" \| "Verified" \| "Rejected",

verificationNotes: String,

createdAt: Date, updatedAt: Date }

Relationships:

Project.user → User.\_id Question Model

Collection:

questions

Purpose:

Stores assessment question bank.

Main fields:

{ skill: String, category: String,

difficulty: "Easy" \| "Medium" \| "Hard",

question: String,

options: \[ String, String, String, String \],

correctAnswer: String, explanation: String,

isActive: Boolean,

createdBy: ObjectId,

createdAt: Date, updatedAt: Date }

Rules:

Exactly 4 options are required. Correct answer must exist in options.
Inactive questions cannot be used in assessments.

Relationships:

Question.createdBy → User.\_id

Supported skills currently include:

Java JavaScript React Node.js Express.js MongoDB HTML CSS SQL Python Git
AssessmentResult Model

Collection:

assessmentresults

Purpose:

Stores completed skill-assessment attempts.

Main fields:

{ user: ObjectId, skill: String,

answers: \[ { questionId: ObjectId, question: String, selectedAnswer:
String, correctAnswer: String, isCorrect: Boolean, explanation: String }
\],

score: Number, totalQuestions: Number, percentage: Number, passed:
Boolean,

attemptNumber: Number, timeTaken: Number,

warnings: Number,

antiCheatEvents: \[ { type: String, message: String, createdAt: Date }
\],

createdAt: Date, updatedAt: Date }

Relationships:

AssessmentResult.user → User.\_id AssessmentResult.answers.questionId →
Question.\_id

Current assessment configuration:

Total Questions: 15 Passing Percentage: 70% Duration: 30 minutes
Certificate Model

Collection:

certificates

Status:

In Progress

Expected fields:

{ certificateId: String,

user: ObjectId, assessmentResult: ObjectId,

skill: String,

score: Number, totalQuestions: Number, percentage: Number,

issuedAt: Date,

qrCode: String, pdfUrl: String,

isValid: Boolean,

createdAt: Date, updatedAt: Date }

Relationships:

Certificate.user → User.\_id Certificate.assessmentResult →
AssessmentResult.\_id

Indexes:

certificateId: unique assessmentResult: unique Notification Model

Collection:

notifications

Purpose:

Stores user notifications.

Main fields:

{ user: ObjectId,

title: String, message: String,

type: "success" \| "warning" \| "error" \| "info",

isRead: Boolean,

createdAt: Date, updatedAt: Date }

Relationships:

Notification.user → User.\_id Chat Message Model

Collection:

messages

Purpose:

Stores developer-recruiter conversations.

Expected fields:

{ sender: ObjectId, receiver: ObjectId,

message: String,

isRead: Boolean,

createdAt: Date, updatedAt: Date }

Relationships:

Message.sender → User.\_id Message.receiver → User.\_id Resume Analysis
Model

Use only if resume results are stored separately.

Possible fields:

{ user: ObjectId,

resumeUrl: String,

atsScore: Number,

detectedSkills: \[String\], missingSkills: \[String\], suggestions:
\[String\],

createdAt: Date, updatedAt: Date } Main Relationships User ├── Projects
├── Assessment Results ├── Certificates ├── Notifications ├── Messages
└── Resume Analysis

Question └── Assessment Result Answers

Assessment Result └── Certificate Deprecated Model

The old Assessment model is no longer used.

Deprecated:

Assessment.js assessmentController.js assessmentRoutes.js

Current assessment architecture uses:

User skills + Question Bank + Runtime assessment generation +
AssessmentResult
