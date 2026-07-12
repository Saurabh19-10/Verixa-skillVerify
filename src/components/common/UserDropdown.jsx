import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function UserDropdown() {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  const initials =
    user?.name
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "DP";

  const profilePath =
    user?.role === "recruiter"
      ? "/recruiter/profile"
      : "/developer/profile";

  return (
    <div
      className="relative"
      ref={dropdownRef}
    >
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="
          flex items-center gap-3
          rounded-xl
          border border-slate-300 dark:border-slate-700
          bg-white dark:bg-slate-900
          px-3 py-2
          transition
          hover:border-blue-500
        "
      >
        <div
          className="
            flex h-10 w-10
            items-center justify-center
            rounded-full
            bg-blue-600
            font-semibold
            text-white
          "
        >
          {initials}
        </div>

        <div className="hidden text-left md:block">
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            {user?.name || "Developer"}
          </p>

          <p className="text-xs text-slate-600 dark:text-slate-400 capitalize">
            {user?.role || "User"}
          </p>
        </div>

        <ChevronDown
          size={16}
          className={`text-slate-600 dark:text-slate-400 transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute right-0 mt-3
            w-64
            overflow-hidden
            rounded-2xl
            border border-slate-200 dark:border-slate-800
            bg-white dark:bg-slate-900
            shadow-2xl
          "
        >
          {/* Header */}
          <div className="border-b border-slate-200 dark:border-slate-800 p-4">
            <p className="font-semibold text-slate-900 dark:text-white">
              {user?.name || "Developer"}
            </p>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              {user?.email || "user@verixa.com"}
            </p>
          </div>

          {/* Menu */}
          <div className="p-2">
            <Link
              to={profilePath}
              className="
                flex items-center gap-3
                rounded-xl px-3 py-3
                text-slate-700 dark:text-slate-300
                transition
                hover:bg-slate-100 dark:hover:bg-slate-800
                hover:text-slate-900 dark:hover:text-white
              "
              onClick={() => setOpen(false)}
            >
              <User size={18} />
              Profile
            </Link>

            <button
              onClick={handleLogout}
              className="
                flex w-full items-center gap-3
                rounded-xl px-3 py-3
                text-red-400
                transition
                hover:bg-red-500/10
              "
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
