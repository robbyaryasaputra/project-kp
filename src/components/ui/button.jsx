import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary-500 text-white shadow-sm hover:bg-primary-600 hover:shadow-md",
        destructive:
          "bg-danger text-white shadow-sm hover:bg-red-600 hover:shadow-md",
        outline:
          "border-2 border-primary-500 text-primary-500 bg-transparent hover:bg-primary-50",
        secondary:
          "bg-secondary-100 text-primary-700 hover:bg-secondary-200",
        ghost:
          "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
        link:
          "text-primary-500 underline-offset-4 hover:underline",
        success:
          "bg-success text-white shadow-sm hover:bg-emerald-600 hover:shadow-md",
        warning:
          "bg-warning text-white shadow-sm hover:bg-amber-600 hover:shadow-md",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
