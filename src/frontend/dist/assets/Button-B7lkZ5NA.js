import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, b as cn } from "./index-Cw2-XxwA.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]];
const LoaderCircle = createLucideIcon("loader-circle", __iconNode);
const variantClasses = {
  primary: "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] shadow-elevated",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border",
  ghost: "bg-transparent text-foreground hover:bg-muted",
  danger: "bg-destructive text-destructive-foreground hover:opacity-90 active:scale-[0.98]",
  success: "bg-chart-2 text-card hover:opacity-90 active:scale-[0.98] shadow-elevated",
  outline: "bg-transparent border border-primary text-primary hover:bg-primary/10"
};
const sizeClasses = {
  sm: "h-8 px-3 text-sm rounded-md gap-1.5",
  md: "h-10 px-4 text-sm rounded-lg gap-2",
  lg: "h-12 px-6 text-base rounded-lg gap-2",
  xl: "h-14 px-8 text-lg rounded-xl gap-3"
};
const Button = reactExports.forwardRef(
  ({
    variant = "primary",
    size = "md",
    loading = false,
    icon,
    fullWidth = false,
    className,
    children,
    disabled,
    ...props
  }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        ref,
        disabled: disabled || loading,
        className: cn(
          "inline-flex items-center justify-center font-display font-semibold transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none",
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && "w-full",
          className
        ),
        ...props,
        children: [
          loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : icon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-shrink-0", children: icon }),
          children
        ]
      }
    );
  }
);
Button.displayName = "Button";
export {
  Button as B,
  LoaderCircle as L
};
