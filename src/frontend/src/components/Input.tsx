import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, type ReactNode, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, hint, leftIcon, rightElement, className, id, ...props },
    ref,
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-display font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-muted-foreground flex-shrink-0">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full h-12 bg-muted/50 border border-input rounded-lg px-4 text-foreground placeholder:text-muted-foreground text-sm font-body transition-smooth",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              leftIcon && "pl-10",
              rightElement && "pr-12",
              error && "border-destructive focus:ring-destructive",
              className,
            )}
            {...props}
          />
          {rightElement && (
            <span className="absolute right-3 flex-shrink-0">
              {rightElement}
            </span>
          )}
        </div>
        {error && (
          <p
            className="text-xs text-destructive font-body"
            data-ocid="input.field_error"
          >
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-muted-foreground font-body">{hint}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
