import { forwardRef } from "react";
import clsx from "clsx";

const Input = forwardRef(
  (
    {
      label,
      error,
      icon,
      type = "text",
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            type={type}
            className={clsx(
              "w-full rounded-xl border",
              "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900",
              "px-4 py-3 text-slate-900 dark:text-white",
              "placeholder:text-slate-500",
              "outline-none transition-all duration-300",
              "focus:border-blue-500",
              "focus:ring-2 focus:ring-blue-500/20",
              icon && "pl-12",
              error && "border-red-500 focus:border-red-500",
              className
            )}
            {...props}
          />
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;