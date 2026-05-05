import { r as reactExports, j as jsxRuntimeExports, b as cn } from "./index-Cw2-XxwA.js";
const Input = reactExports.forwardRef(
  ({ label, error, hint, leftIcon, rightElement, className, id, ...props }, ref) => {
    const inputId = id ?? (label == null ? void 0 : label.toLowerCase().replace(/\s+/g, "-"));
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
      label && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "label",
        {
          htmlFor: inputId,
          className: "text-sm font-display font-medium text-foreground",
          children: label
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center", children: [
        leftIcon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 text-muted-foreground flex-shrink-0", children: leftIcon }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref,
            id: inputId,
            className: cn(
              "w-full h-12 bg-muted/50 border border-input rounded-lg px-4 text-foreground placeholder:text-muted-foreground text-sm font-body transition-smooth",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              leftIcon && "pl-10",
              rightElement && "pr-12",
              error && "border-destructive focus:ring-destructive",
              className
            ),
            ...props
          }
        ),
        rightElement && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-3 flex-shrink-0", children: rightElement })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-xs text-destructive font-body",
          "data-ocid": "input.field_error",
          children: error
        }
      ),
      hint && !error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: hint })
    ] });
  }
);
Input.displayName = "Input";
export {
  Input as I
};
