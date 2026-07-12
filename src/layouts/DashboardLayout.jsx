import Sidebar from "../components/Sidebar/Sidebar";
import DashboardTopbar from "./DashboardTopbar";

export default function DashboardLayout({
  children,
  recruiter = false,
  title,
  subtitle,
}) {
  const defaultTitle = recruiter
    ? "Recruiter Dashboard"
    : "Developer Dashboard";

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar recruiter={recruiter} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        
        {/* Topbar */}
        <DashboardTopbar />

        {/* Page Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 px-8 py-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {title || defaultTitle}
          </h1>

          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {subtitle || "Welcome back to Verixa"}
          </p>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
