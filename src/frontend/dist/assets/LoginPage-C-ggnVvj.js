import { r as reactExports, u as useNavigate, j as jsxRuntimeExports, L as Link } from "./index-Cw2-XxwA.js";
import { B as Button } from "./Button-B7lkZ5NA.js";
import { C as Card } from "./authStore-BmLagjk9.js";
import { I as Input } from "./Input-DiH7GCvm.js";
import { u as useBackend } from "./useBackend-BPKkznfX.js";
import { m as motion } from "./proxy-DTMhG-5M.js";
import { Z as Zap } from "./zap-D4UHrrNd.js";
import { P as Phone, E as EyeOff, a as Eye, L as Lock } from "./phone-CAXq8Rb0.js";
function LoginPage() {
  const [phone, setPhone] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const { login } = useBackend();
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!phone || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    const result = await login(phone.trim(), password);
    if (result.success) {
      navigate({ to: "/" });
    } else {
      setError(result.error);
    }
    setLoading(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col", "data-ocid": "login.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "aria-hidden": "true",
        className: "pointer-events-none fixed inset-0 overflow-hidden",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent/8 blur-3xl" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex flex-col items-center justify-center px-4 py-10 relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          className: "text-center space-y-3",
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45, ease: "easeOut" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center glow-cyan", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl font-display font-bold text-gradient-cyan tracking-tight", children: "FPay" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body", children: "Demo Payment Simulator" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay: 0.1, ease: "easeOut" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { variant: "elevated", padding: "lg", className: "space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold text-foreground", children: "Sign in" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Enter your phone number and password" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleLogin, className: "space-y-4", noValidate: true, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  label: "Phone Number",
                  type: "tel",
                  inputMode: "numeric",
                  placeholder: "Enter 10-digit number",
                  value: phone,
                  onChange: (e) => {
                    setPhone(e.target.value);
                    if (error) setError("");
                  },
                  leftIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-4 h-4" }),
                  autoComplete: "tel",
                  "data-ocid": "login.phone_input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  label: "Password",
                  type: showPassword ? "text" : "password",
                  placeholder: "Enter your password",
                  value: password,
                  onChange: (e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  },
                  leftIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-4 h-4" }),
                  rightElement: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowPassword((v) => !v),
                      className: "text-muted-foreground hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded",
                      "aria-label": showPassword ? "Hide password" : "Show password",
                      children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" })
                    }
                  ),
                  autoComplete: "current-password",
                  "data-ocid": "login.password_input"
                }
              ),
              error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.p,
                {
                  className: "text-sm text-destructive flex items-center gap-1.5",
                  "data-ocid": "login.error_state",
                  initial: { opacity: 0, x: -6 },
                  animate: { opacity: 1, x: 0 },
                  transition: { duration: 0.25 },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0" }),
                    error
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  fullWidth: true,
                  size: "lg",
                  loading,
                  className: "mt-2",
                  "data-ocid": "login.submit_button",
                  children: loading ? "Signing in…" : "Sign in"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full border-t border-border" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex justify-center text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-card px-3 text-muted-foreground", children: "Don't have an account?" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/signup",
                "data-ocid": "login.signup_link",
                className: "block w-full",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    fullWidth: true,
                    size: "md",
                    className: "font-semibold",
                    children: "Create account"
                  }
                )
              }
            )
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.p,
        {
          className: "text-center text-xs text-muted-foreground leading-relaxed",
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { delay: 0.4 },
          children: [
            "This app is for simulation only.",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-accent font-medium", children: "No real money" }),
            " is involved."
          ]
        }
      )
    ] }) })
  ] });
}
export {
  LoginPage as default
};
