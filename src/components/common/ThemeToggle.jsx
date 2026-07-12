import { useState, useRef, useEffect } from "react";
import { Palette, Check } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, setTheme, themes, currentTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="
          flex items-center justify-center gap-1.5
          w-auto px-3 h-10
          rounded-xl
          border border-slate-300 dark:border-slate-700
          bg-white dark:bg-slate-900
          text-slate-700 dark:text-slate-300
          transition-all duration-300
          hover:border-blue-500
          hover:text-slate-900 dark:hover:text-white
          text-sm font-medium
        "
        aria-label="Select Theme"
      >
        <span>{currentTheme?.icon || "🎨"}</span>
        <Palette size={15} />
      </button>

      {open && (
        <div
          className="
            absolute right-0 mt-3 z-50
            w-72
            rounded-2xl
            border border-slate-200 dark:border-slate-800
            bg-white dark:bg-slate-900
            shadow-2xl
            overflow-hidden
          "
        >
          <div className="p-3 border-b border-slate-200 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
              Choose Theme
            </p>
          </div>
          <div className="p-2 grid grid-cols-2 gap-1">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); setOpen(false); }}
                className={`
                  flex items-center gap-2 px-3 py-2.5 rounded-xl text-left
                  transition-all duration-200
                  ${theme === t.id
                    ? "bg-blue-500/10 border border-blue-500/30"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent"
                  }
                `}
              >
                {/* Color preview dots */}
                <div className="flex gap-0.5 shrink-0">
                  {t.preview.map((color, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {t.icon} {t.label}
                  </p>
                </div>
                {theme === t.id && (
                  <Check size={13} className="text-blue-500 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
