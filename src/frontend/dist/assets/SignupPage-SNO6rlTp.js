import { r as reactExports, u as useNavigate, j as jsxRuntimeExports, L as Link } from "./index-Cw2-XxwA.js";
import { B as Button } from "./Button-B7lkZ5NA.js";
import { C as Card } from "./authStore-BmLagjk9.js";
import { I as Input } from "./Input-DiH7GCvm.js";
import { u as useBackend } from "./useBackend-BPKkznfX.js";
import { m as motion } from "./proxy-DTMhG-5M.js";
import { Z as Zap } from "./zap-D4UHrrNd.js";
import { U as User } from "./user-DfRmn4aJ.js";
import { P as Phone, E as EyeOff, a as Eye, L as Lock } from "./phone-CAXq8Rb0.js";
import { S as Shield } from "./shield-FLL3bOfX.js";
function SignupPage() {
  const [name, setName] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [pin, setPin] = reactExports.useState("");
  const [confirmPin, setConfirmPin] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = reactExports.useState(false);
  const [errors, setErrors] = reactExports.useState({});
  const [loading, setLoading] = reactExports.useState(false);
  const { register } = useBackend();
  const navigate = useNavigate();
  const clearFieldError = (field) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };
  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = "Full name is required.";
    if (!phone.trim()) {
      next.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(phone.trim())) {
      next.phone = "Enter a valid 10-digit phone number.";
    }
    if (!password) {
      next.password = "Password is required.";
    } else if (password.length < 6) {
      next.password = "Password must be at least 6 characters.";
    }
    if (!confirmPassword) {
      next.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      next.confirmPassword = "Passwords do not match.";
    }
    if (!pin) {
      next.pin = "Transaction PIN is required.";
    } else if (!/^\d{4}$/.test(pin)) {
      next.pin = "PIN must be exactly 4 digits.";
    }
    if (!confirmPin) {
      next.confirmPin = "Please confirm your PIN.";
    } else if (pin !== confirmPin) {
      next.confirmPin = "PINs do not match.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const result = await register(name.trim(), phone.trim(), password, pin);
    if (result.success) {
      navigate({ to: "/" });
    } else {
      setErrors({ form: result.error });
    }
    setLoading(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col", "data-ocid": "signup.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "aria-hidden": "true",
        className: "pointer-events-none fixed inset-0 overflow-hidden",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-24 -right-24 w-80 h-80 rounded-full bg-primary/10 blur-3xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-accent/8 blur-3xl" })
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-body", children: "Simulation payment app — for educational use only" })
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold text-foreground", children: "Create account" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                "You'll start with",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: "₹1,000" }),
                " ",
                "virtual balance"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSignup, className: "space-y-4", noValidate: true, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  label: "Full Name",
                  placeholder: "Your full name",
                  value: name,
                  onChange: (e) => {
                    setName(e.target.value);
                    clearFieldError("name");
                  },
                  leftIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4" }),
                  error: errors.name,
                  autoComplete: "name",
                  "data-ocid": "signup.name_input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  label: "Phone Number",
                  type: "tel",
                  inputMode: "numeric",
                  placeholder: "10-digit number",
                  value: phone,
                  onChange: (e) => {
                    setPhone(e.target.value);
                    clearFieldError("phone");
                  },
                  leftIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-4 h-4" }),
                  error: errors.phone,
                  autoComplete: "tel",
                  "data-ocid": "signup.phone_input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  label: "Password",
                  type: showPassword ? "text" : "password",
                  placeholder: "Min 6 characters",
                  value: password,
                  onChange: (e) => {
                    setPassword(e.target.value);
                    clearFieldError("password");
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
                  error: errors.password,
                  autoComplete: "new-password",
                  "data-ocid": "signup.password_input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  label: "Confirm Password",
                  type: showConfirmPassword ? "text" : "password",
                  placeholder: "Re-enter password",
                  value: confirmPassword,
                  onChange: (e) => {
                    setConfirmPassword(e.target.value);
                    clearFieldError("confirmPassword");
                  },
                  leftIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-4 h-4" }),
                  rightElement: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowConfirmPassword((v) => !v),
                      className: "text-muted-foreground hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded",
                      "aria-label": showConfirmPassword ? "Hide confirm password" : "Show confirm password",
                      children: showConfirmPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" })
                    }
                  ),
                  error: errors.confirmPassword,
                  autoComplete: "new-password",
                  "data-ocid": "signup.confirm_password_input"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-1 pb-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground font-display font-medium", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-3.5 h-3.5 text-primary" }),
                    "Transaction Security"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      label: "Transaction PIN",
                      type: "password",
                      inputMode: "numeric",
                      placeholder: "4-digit PIN",
                      maxLength: 4,
                      value: pin,
                      onChange: (e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                        setPin(val);
                        clearFieldError("pin");
                      },
                      leftIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4" }),
                      error: errors.pin,
                      autoComplete: "new-password",
                      "data-ocid": "signup.pin_input"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      label: "Confirm Transaction PIN",
                      type: "password",
                      inputMode: "numeric",
                      placeholder: "Re-enter 4-digit PIN",
                      maxLength: 4,
                      value: confirmPin,
                      onChange: (e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                        setConfirmPin(val);
                        clearFieldError("confirmPin");
                      },
                      leftIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4" }),
                      error: errors.confirmPin,
                      autoComplete: "new-password",
                      "data-ocid": "signup.confirm_pin_input"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-2 font-body", children: "You'll need this PIN every time you send money." })
              ] }),
              errors.form && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.p,
                {
                  className: "text-sm text-destructive flex items-center gap-1.5",
                  "data-ocid": "signup.error_state",
                  initial: { opacity: 0, x: -6 },
                  animate: { opacity: 1, x: 0 },
                  transition: { duration: 0.25 },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0" }),
                    errors.form
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
                  "data-ocid": "signup.submit_button",
                  children: loading ? "Creating account…" : "Create account"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full border-t border-border" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex justify-center text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-card px-3 text-muted-foreground", children: "Already have an account?" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/login",
                "data-ocid": "signup.login_link",
                className: "block w-full",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    fullWidth: true,
                    size: "md",
                    className: "font-semibold",
                    children: "Sign in instead"
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
          transition: { delay: 0.45 },
          children: [
            "Starting balance:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-medium", children: "₹1,000 virtual" }),
            ". Simulation only — no real transactions."
          ]
        }
      )
    ] }) })
  ] });
}
export {
  SignupPage as default
};
