import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

import {
  Award,
  BadgeCheck,
  Brain,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FileText,
  FolderGit2,
  LayoutDashboard,
  MessageCircle,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";

import verixaIcon from "../../assets/verixa-icon.png";
import ThemeToggle from "../common/ThemeToggle";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar({ recruiter = false }) {
  const [collapsed, setCollapsed] = useState(false);
  const { role } = useAuth();

  const developerLinks = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/developer/dashboard",
    },
    {
      name: "Profile",
      icon: <User size={20} />,
      path: "/developer/profile",
    },
    {
      name: "Projects",
      icon: <FolderGit2 size={20} />,
      path: "/developer/projects",
    },
    {
      name: "Assessments",
      icon: <ClipboardCheck size={20} />,
      path: "/developer/assessments",
    },
    {
      name: "Certificates",
      icon: <Award size={20} />,
      path: "/developer/certificates",
    },
    {
      name: "Verification",
      icon: <BadgeCheck size={20} />,
      path: "/developer/verification",
    },
    {
      name: "AI Review",
      icon: <Brain size={20} />,
      path: "/developer/ai-review",
    },
    {
      name: "Messages",
      icon: <MessageCircle size={20} />,
      upcoming: true,
    },
  ];

  const recruiterLinks = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/recruiter/dashboard",
    },
    {
      name: "Profile",
      icon: <User size={20} />,
      path: "/recruiter/profile",
    },
    {
      name: "Search",
      icon: <Users size={20} />,
      path: "/recruiter/search",
    },
    {
      name: "Compare",
      icon: <Users size={20} />,
      path: "/recruiter/compare",
    },
    {
      name: "Shortlist",
      icon: <BadgeCheck size={20} />,
      path: "/recruiter/shortlist",
    },
    {
      name: "Reports",
      icon: <FileText size={20} />,
      path: "/recruiter/reports",
    },
    {
      name: "Messages",
      icon: <MessageCircle size={20} />,
      upcoming: true,
    },
  ];

  const adminLinks = [
    {
      name: "Admin Panel",
      icon: <ShieldCheck size={20} />,
      path: "/admin/dashboard",
    },
    {
      name: "Users",
      icon: <Users size={20} />,
      path: "/admin/dashboard",
    },
    {
      name: "Projects",
      icon: <FolderGit2 size={20} />,
      path: "/admin/dashboard",
    },
    {
      name: "AI Reviews",
      icon: <Brain size={20} />,
      path: "/admin/dashboard",
    },
    {
      name: "Questions",
      icon: <ClipboardCheck size={20} />,
      path: "/admin/questions",
    },
    {
      name: "Assessments",
      icon: <ClipboardCheck size={20} />,
      path: "/admin/assessments",
    },
  ];

  const links =
    role === "admin"
      ? adminLinks
      : recruiter
        ? recruiterLinks
        : developerLinks;

  return (
    <aside
      className={`
        sticky top-0
        flex h-screen flex-col
        border-r border-slate-200
        bg-slate-50
        transition-all duration-300
        dark:border-slate-800
        dark:bg-slate-950
        ${collapsed ? "w-20" : "w-72"}
      `}
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5 dark:border-slate-800">
        <Link
          to={role === "admin" ? "/admin/dashboard" : "/"}
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 p-1.5 dark:bg-black">
            <img
              src={verixaIcon}
              alt="Verixa"
              className="h-full w-full object-contain"
            />
          </div>

          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Verixa
              </h1>

              <p className="text-xs text-slate-600 dark:text-slate-400">
                {role === "admin"
                  ? "Admin Control"
                  : "Proof of Skills"}
              </p>
            </div>
          )}
        </Link>

        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={
            collapsed ? "Expand sidebar" : "Collapse sidebar"
          }
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </div>

      <nav className="mt-6 flex-1 px-3">
        <ul className="space-y-2">
          {links.map((item, index) => (
            <li key={`${item.path || item.name}-${index}`}>
              {item.upcoming ? (
                <div
                  title="Coming soon"
                  className="
                    flex cursor-not-allowed items-center gap-3
                    rounded-xl px-4 py-3
                    text-slate-400 opacity-70
                    dark:text-slate-500
                  "
                >
                  <span className="shrink-0">
                    {item.icon}
                  </span>

                  {!collapsed && (
                    <>
                      <span className="font-medium">
                        {item.name}
                      </span>

                      <span className="ml-auto rounded-full bg-yellow-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-yellow-500">
                        Upcoming
                      </span>
                    </>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `
                      flex items-center gap-3
                      rounded-xl px-4 py-3
                      transition-all duration-200
                      ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-slate-600 hover:bg-white hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                      }
                    `
                  }
                >
                  <span className="shrink-0">
                    {item.icon}
                  </span>

                  {!collapsed && (
                    <span className="font-medium">
                      {item.name}
                    </span>
                  )}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto border-t border-slate-200 p-4 dark:border-slate-800">
        <div
          className={
            collapsed
              ? "flex justify-center"
              : "flex items-center justify-between"
          }
        >
          {!collapsed && (
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Theme
            </span>
          )}

          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}