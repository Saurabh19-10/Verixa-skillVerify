import clsx from "clsx";

const variants = {
  primary:
    "bg-blue-500/10 text-blue-400 border border-blue-500/20",

  success:
    "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",

  warning:
    "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",

  danger:
    "bg-red-500/10 text-red-400 border border-red-500/20",

  purple:
    "bg-purple-500/10 text-purple-400 border border-purple-500/20",

  gray:
    "bg-slate-200/30 dark:bg-slate-700/30 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600",
};

const sizes = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
  lg: "px-4 py-2 text-base",
};

export default function Badge({
  children,
  variant = "primary",
  size = "md",
  className = "",
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center rounded-full font-medium",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}