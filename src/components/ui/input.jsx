import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm transition-colors duration-200",
        "placeholder:text-neutral-400",
        "focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-100",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
