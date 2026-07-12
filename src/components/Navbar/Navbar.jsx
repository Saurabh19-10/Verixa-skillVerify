import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

import Button from "../ui/Button";
import ThemeToggle from "../common/ThemeToggle";
import verixaIcon from "../../assets/verixa-icon.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: "Features", hash: "features" },
    { name: "How It Works", hash: "how-it-works" },
    { name: "Developers", hash: "developers" },
    { name: "Recruiters", hash: "recruiters" },
  ];

  const handleAnchorClick = (hash) => {
    setIsOpen(false);
    if (location.pathname === "/") {
      // Already on home page — smooth scroll
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // Navigate home with hash
      navigate(`/#${hash}`);
    }
  };

  return (
    <header
      className="
        sticky top-0 z-50
        border-b border-slate-200 dark:border-slate-800
        bg-slate-50/80 dark:bg-slate-950/80
        backdrop-blur-xl
      "
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              bg-slate-900
              dark:bg-black
              p-1.5
            "
          >
            <img src={verixaIcon} alt="Verixa" className="h-full w-full object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Verixa</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">Proof of Skills</p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((item) => (
            <button
              key={item.name}
              onClick={() => handleAnchorClick(item.hash)}
              className="
                text-sm font-medium
                text-slate-700 dark:text-slate-300
                transition
                hover:text-slate-900 dark:hover:text-white
                cursor-pointer
              "
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />

          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>

          <Link to="/register">
            <Button>Get Started</Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-700 dark:text-slate-300 md:hidden"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="
            border-t border-slate-200 dark:border-slate-800
            bg-slate-50 dark:bg-slate-950
            md:hidden
          "
        >
          <div className="space-y-4 px-6 py-6">
            {navLinks.map((item) => (
              <button
                key={item.name}
                onClick={() => handleAnchorClick(item.hash)}
                className="
                  block w-full text-left
                  text-slate-700 dark:text-slate-300
                  transition
                  hover:text-slate-900 dark:hover:text-white
                "
              >
                {item.name}
              </button>
            ))}

            <div className="flex justify-center py-2">
              <ThemeToggle />
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Link to="/login">
                <Button variant="secondary" className="w-full" onClick={() => setIsOpen(false)}>
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="w-full" onClick={() => setIsOpen(false)}>
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
