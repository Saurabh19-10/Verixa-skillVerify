import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

// Public Pages
import HomePage from "../pages/HomePage";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import VerifyEmail from "../pages/Auth/VerifyEmail";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import OAuthSuccess from "../pages/Auth/OAuthSuccess";
import CertificateVerification from "../pages/Public/CertificateVerification";
import NotFound from "../pages/NotFound";

// Developer Pages
import Dashboard from "../pages/Developer/Dashboard";
import Profile from "../pages/Developer/Profile";
import Projects from "../pages/Developer/Projects";
import Assessments from "../pages/Developer/Assessments";
import AssessmentPlayer from "../pages/Developer/AssessmentPlayer";
import Verification from "../pages/Developer/Verification";
import AIReview from "../pages/Developer/AIReview";
import ResumeAnalyzer from "../pages/Developer/ResumeAnalyzer";
import Certificates from "../pages/Developer/Certificates";

// Recruiter Pages
import RecruiterDashboard from "../pages/Recruiter/Dashboard";
import SearchDevelopers from "../pages/Recruiter/SearchDevelopers";
import CompareDevelopers from "../pages/Recruiter/CompareDevelopers";
import ShortlistedCandidates from "../pages/Recruiter/ShortlistedCandidates";
import Reports from "../pages/Recruiter/Reports";
import DeveloperDetails from "../pages/Recruiter/DeveloperDetails";
import RecruiterProfile from "../pages/Recruiter/Profile";

// Admin Pages
import AdminDashboard from "../pages/Admin/AdminDashboard";
import Questions from "../pages/Admin/Questions";

// Chat Page
import Chat from "../pages/Chat/Chat";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/verify-email"
        element={<VerifyEmail />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />

      <Route
        path="/oauth-success"
        element={<OAuthSuccess />}
      />

      <Route
        path="/certificate/:certificateId"
        element={<CertificateVerification />}
      />

      {/* Developer Routes */}
      <Route
        path="/developer/dashboard"
        element={
          <ProtectedRoute allowedRoles={["developer"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/developer/profile"
        element={
          <ProtectedRoute allowedRoles={["developer"]}>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/developer/projects"
        element={
          <ProtectedRoute allowedRoles={["developer"]}>
            <Projects />
          </ProtectedRoute>
        }
      />

      <Route
        path="/developer/assessments"
        element={
          <ProtectedRoute allowedRoles={["developer"]}>
            <Assessments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/developer/assessment"
        element={
          <ProtectedRoute allowedRoles={["developer"]}>
            <AssessmentPlayer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/developer/verification"
        element={
          <ProtectedRoute allowedRoles={["developer"]}>
            <Verification />
          </ProtectedRoute>
        }
      />

      <Route
        path="/developer/ai-review"
        element={
          <ProtectedRoute allowedRoles={["developer"]}>
            <AIReview />
          </ProtectedRoute>
        }
      />

      <Route
        path="/developer/resume-analyzer"
        element={
          <ProtectedRoute allowedRoles={["developer"]}>
            <ResumeAnalyzer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/developer/certificates"
        element={
          <ProtectedRoute allowedRoles={["developer"]}>
            <Certificates />
          </ProtectedRoute>
        }
      />

      {/* Recruiter Routes */}
      <Route
        path="/recruiter/dashboard"
        element={
          <ProtectedRoute allowedRoles={["recruiter"]}>
            <RecruiterDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/profile"
        element={
          <ProtectedRoute allowedRoles={["recruiter"]}>
            <RecruiterProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/search"
        element={
          <ProtectedRoute allowedRoles={["recruiter"]}>
            <SearchDevelopers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/developer/:id"
        element={
          <ProtectedRoute allowedRoles={["recruiter"]}>
            <DeveloperDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/compare"
        element={
          <ProtectedRoute allowedRoles={["recruiter"]}>
            <CompareDevelopers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/shortlist"
        element={
          <ProtectedRoute allowedRoles={["recruiter"]}>
            <ShortlistedCandidates />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/reports"
        element={
          <ProtectedRoute allowedRoles={["recruiter"]}>
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/questions"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Questions />
          </ProtectedRoute>
        }
      />

      {/* Chat Route */}
      <Route
        path="/chat"
        element={
          <ProtectedRoute
            allowedRoles={[
              "developer",
              "recruiter",
              "admin",
            ]}
          >
            <Chat />
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}