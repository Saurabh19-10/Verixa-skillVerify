import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
  allowedRoles = [],
}) {
  const { user, loading } = useAuth();

  // Loading State
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div
            className="
              mx-auto h-12 w-12
              animate-spin rounded-full
              border-4 border-slate-300 dark:border-slate-700
              border-t-blue-500
            "
          />

          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // User Not Logged In
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Role Access Check
  // Role Access Check
if (
  allowedRoles.length > 0 &&
  !allowedRoles.includes(user.role)
) {
  if (user.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user.role === "recruiter") {
    return <Navigate to="/recruiter/dashboard" replace />;
  }

  return <Navigate to="/developer/dashboard" replace />;
}

  return children;
}