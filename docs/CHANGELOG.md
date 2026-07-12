VERIXA CHANGELOG

All major project changes should be recorded here.

Unreleased

### Added

-   Refresh Token authentication
-   Refresh Token Rotation
-   `POST /api/auth/refresh-token`
-   HttpOnly `verixa_refresh_token` cookie
-   Hashed refresh token storage
-   Refresh token expiry tracking
-   Automatic Axios access-token refresh
-   Concurrent refresh request protection
-   Helmet security headers
-   Global API rate limiting
-   Strict authentication rate limiting
-   Response compression with 1024-byte threshold

### Changed

-   Access JWT lifetime is configurable through `JWT_EXPIRE`
-   Authentication now uses short-lived access tokens with rotating
    refresh sessions
-   Logout invalidates the stored refresh session and clears the refresh
    cookie
-   Password changes invalidate refresh sessions
-   Authentication middleware validates access-token type
-   Authentication middleware rejects tokens issued before the latest
    password change
-   Shared Axios client automatically refreshes expired access tokens
    and retries failed protected requests

### Security

-   Refresh tokens use a separate `JWT_REFRESH_SECRET`
-   Refresh tokens are SHA-256 hashed before MongoDB storage
-   Refresh token reuse invalidates the current refresh session
-   Refresh cookies are HttpOnly with environment-aware Secure and
    SameSite settings
-   Helmet security headers are enabled
-   `/api` is protected by a global rate limiter
-   Sensitive public authentication endpoints use a stricter
    failed-attempt limiter
-   Eligible responses are compressed to reduce payload size

### Added

-   Email OTP Verification
-   Verify Email API
-   Resend Verification OTP
-   Forgot Password API
-   Reset Password API
-   Nodemailer Email Service
-   Gmail SMTP Integration
-   Verification Email Templates
-   Password Reset Email Templates
-   Verify Email Frontend Page
-   Forgot Password Frontend Page
-   Reset Password Frontend Page

### Changed

-   Authentication flow now requires email verification before login.
-   Registration flow updated to support OTP verification.
-   Unverified users can re-register with updated credentials.
-   AuthContext updated to support email verification flow.

### Fixed

-   Fixed password hashing issue for unverified users.
-   Fixed login issue after email verification.
-   Fixed reset password link generation.
-   Fixed SMTP email configuration.
-   Fixed assessment certificate generation dependency. Authentication
    Email OTP verification planned. Forgot password planned. Reset
    password planned. Change password planned. Refresh token planned.
    Certificates Skill-based certificate generation in progress. PDF
    generation pending. QR verification pending. GitHub GitHub API
    verification pending. Version 0.9.0 Added Dynamic skill-based
    assessment engine. Automatic assessment cards based on profile
    skills. Runtime random question selection. 15-question assessment
    format. 70% passing criteria. Assessment result storage. Attempt
    number tracking. Timer and auto-submit. Anti-cheat warning tracking.
    Dashboard redirect after submission. Assessment result summary on
    dashboard. Automatic Trust Score recalculation. Changed Replaced old
    manual Assessment model. Removed dependency on admin-created
    assessments. Migrated assessment APIs to: /api/skill-assessments
    Removed Old Assessment model. Old assessment controller. Old
    assessment routes. Admin manual assessment creation flow. Version
    0.8.0 Added Question Bank model. Admin question management. Question
    creation, update and delete APIs. CSV and Excel question import.
    Question statistics. Question seeder. Question generator. Supported
    skill aliases.

Supported skills:

Java JavaScript React Node.js Express.js MongoDB HTML CSS SQL Python Git
Version 0.7.0 Added Trust Score service. Verified project contribution.
Assessment score contribution. GitHub score contribution. Profile
completeness contribution. Version 0.6.0 Added Developer dashboard.
Recruiter dashboard. Admin dashboard. Dashboard statistics. Profile
overview. Recent activity. Verification progress. Version 0.5.0 Added
Project CRUD. Project verification. Developer project management.
Project status tracking. Version 0.4.0 Added Developer profile. Skills
management. Bio. Portfolio URL. GitHub username. Avatar upload. Resume
upload. Version 0.3.0 Added Socket.io chat. Online user tracking. Send
message. Receive message. Typing indicators. Version 0.2.0 Added React
frontend. Vite setup. Tailwind CSS. Dark and light mode. Sidebar.
Navbar. Protected frontend routes. Developer, recruiter and admin
layouts. Version 0.1.0 Added Express backend. MongoDB connection. User
registration. User login. JWT authentication. Role-based authorization.
Protected backend routes. Google OAuth support. Changelog Rules

Whenever work is completed:

Add it under Unreleased. When a milestone is complete, create a new
version. Use these headings: Added Changed Fixed Removed Security

Example:

## Unreleased

### Added

-   Refresh Token authentication
-   Refresh Token Rotation
-   `POST /api/auth/refresh-token`
-   HttpOnly `verixa_refresh_token` cookie
-   Hashed refresh token storage
-   Refresh token expiry tracking
-   Automatic Axios access-token refresh
-   Concurrent refresh request protection
-   Helmet security headers
-   Global API rate limiting
-   Strict authentication rate limiting
-   Response compression with 1024-byte threshold

### Changed

-   Access JWT lifetime is configurable through `JWT_EXPIRE`
-   Authentication now uses short-lived access tokens with rotating
    refresh sessions
-   Logout invalidates the stored refresh session and clears the refresh
    cookie
-   Password changes invalidate refresh sessions
-   Authentication middleware validates access-token type
-   Authentication middleware rejects tokens issued before the latest
    password change
-   Shared Axios client automatically refreshes expired access tokens
    and retries failed protected requests

### Security

-   Refresh tokens use a separate `JWT_REFRESH_SECRET`
-   Refresh tokens are SHA-256 hashed before MongoDB storage
-   Refresh token reuse invalidates the current refresh session
-   Refresh cookies are HttpOnly with environment-aware Secure and
    SameSite settings
-   Helmet security headers are enabled
-   `/api` is protected by a global rate limiter
-   Sensitive public authentication endpoints use a stricter
    failed-attempt limiter
-   Eligible responses are compressed to reduce payload size

### Fixed

-   Fixed assessment card visibility for MongoDB aliases.
-   Fixed port 5050 connection issue on Windows.
