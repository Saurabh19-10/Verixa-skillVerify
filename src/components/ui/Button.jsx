import { motion } from "framer-motion";
import clsx from "clsx";

const variants = {
  primary:
    "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20",

  secondary:
    "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700",

  outline:
    "border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",

  success:
    "bg-emerald-600 hover:bg-emerald-700 text-white",

  danger:
    "bg-red-600 hover:bg-red-700 text-white",

  ghost:
    "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white",
};

const sizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
  xl: "px-8 py-4 text-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  className,
  type = "button",
  onClick,
}) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.03 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(
        "inline-flex items-center justify-center gap-2",
        "rounded-xl font-semibold transition-all duration-300",
        "focus:outline-none focus:ring-2 focus:ring-blue-500",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {loading ? (
        <>
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              opacity="0.25"
            />
            <path
              d="M22 12a10 10 0 0 1-10 10"
              stroke="currentColor"
              strokeWidth="4"
            />
          </svg>

          Loading...
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
}