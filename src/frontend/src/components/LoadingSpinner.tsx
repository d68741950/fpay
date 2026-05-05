import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizeClasses = {
  sm: "w-4 h-4 border-2",
  md: "w-8 h-8 border-2",
  lg: "w-12 h-12 border-3",
};

export function LoadingSpinner({
  size = "md",
  className,
  label,
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className,
      )}
      aria-label={label ?? "Loading"}
    >
      <div
        className={cn(
          "rounded-full border-primary/30 border-t-primary animate-spin",
          sizeClasses[size],
        )}
      />
      {label && (
        <span className="text-sm text-muted-foreground font-body animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
}

export function FullPageLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-background"
      data-ocid="app.loading_state"
    >
      <LoadingSpinner size="lg" label={label} />
    </div>
  );
}
