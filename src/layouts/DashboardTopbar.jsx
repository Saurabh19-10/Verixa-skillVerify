import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";

import ThemeToggle from "../components/common/ThemeToggle";
import UserDropdown from "../components/common/UserDropdown";
import NotificationBell from "../components/notifications/NotificationBell";
import { useAuth } from "../context/AuthContext";

export default function DashboardTopbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { role } = useAuth();

  const destination =
    role === "recruiter"
      ? "/recruiter/search"
      : "/developer/projects";

  const placeholder =
    role === "recruiter"
      ? "Search developers..."
      : "Search projects...";

  const runSearch = () => {
    const trimmed = query.trim();

    navigate(
      trimmed
        ? `${destination}?q=${encodeURIComponent(trimmed)}`
        : destination
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runSearch();
    }
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <div className="relative hidden md:block">
        <button
          type="button"
          onClick={runSearch}
          aria-label="Search"
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-blue-500"
        >
          <Search size={18} />
        </button>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-80 rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-10 text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-900 dark:hover:text-white"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="ml-auto flex items-center gap-4">
        <NotificationBell />
        <ThemeToggle />
        <UserDropdown />
      </div>
    </header>
  );
}