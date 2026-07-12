import { motion } from "framer-motion";

export default function Loader({
  size = "md",
  text,
  fullScreen = false,
}) {
  const sizes = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-4",
    xl: "h-16 w-16 border-4",
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear",
        }}
        className={`
          rounded-full
          border-blue-500
          border-t-transparent
          ${sizes[size]}
        `}
      />

      {text && (
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        {content}
      </div>
    );
  }

  return content;
}