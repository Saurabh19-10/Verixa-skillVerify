import { motion } from "framer-motion";
import clsx from "clsx";

export default function Card({
  children,
  title,
  subtitle,
  icon,
  className = "",
  hover = true,
  padding = "md",
  onClick,
}) {
  const paddings = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <motion.div
      whileHover={
        hover
          ? {
              y: -5,
              transition: { duration: 0.2 },
            }
          : {}
      }
      onClick={onClick}
      whileTap={onClick ? { scale: 0.98 } : {}}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick(e);
              }
            }
          : undefined
      }
      className={clsx(
        "relative overflow-hidden rounded-2xl",
        "border border-slate-200 dark:border-slate-800",
        "bg-white/70 dark:bg-slate-900/70 backdrop-blur-md",
        "shadow-lg",
        paddings[padding],
        className
      )}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-cyan-500/5 pointer-events-none" />

      {(title || subtitle || icon) && (
        <div className="relative mb-5 flex items-start gap-4">
          {icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-500 text-xl">
              {icon}
            </div>
          )}

          <div>
            {title && (
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {title}
              </h3>
            )}

            {subtitle && (
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="relative">
        {children}
      </div>
    </motion.div>
  );
}