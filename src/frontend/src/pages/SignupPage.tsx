import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Phone, Shield, User, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { useBackend } from "../hooks/useBackend";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { register } = useBackend();
  const navigate = useNavigate();

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
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

  const handleSignup = async (e: React.FormEvent) => {
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

  return (
    <div className="flex-1 flex flex-col" data-ocid="signup.page">
      {/* Decorative gradient blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-accent/8 blur-3xl" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 relative z-10">
        <div className="w-full max-w-sm space-y-6">
          {/* Brand */}
          <motion.div
            className="text-center space-y-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center glow-cyan">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <span className="text-4xl font-display font-bold text-gradient-cyan tracking-tight">
                FPay
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-body">
              Simulation payment app — for educational use only
            </p>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <Card variant="elevated" padding="lg" className="space-y-5">
              <div className="space-y-1">
                <h1 className="text-xl font-display font-bold text-foreground">
                  Create account
                </h1>
                <p className="text-sm text-muted-foreground">
                  You'll start with{" "}
                  <span className="text-primary font-semibold">₹1,000</span>{" "}
                  virtual balance
                </p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4" noValidate>
                <Input
                  label="Full Name"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearFieldError("name");
                  }}
                  leftIcon={<User className="w-4 h-4" />}
                  error={errors.name}
                  autoComplete="name"
                  data-ocid="signup.name_input"
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  inputMode="numeric"
                  placeholder="10-digit number"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    clearFieldError("phone");
                  }}
                  leftIcon={<Phone className="w-4 h-4" />}
                  error={errors.phone}
                  autoComplete="tel"
                  data-ocid="signup.phone_input"
                />
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearFieldError("password");
                  }}
                  leftIcon={<Lock className="w-4 h-4" />}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  }
                  error={errors.password}
                  autoComplete="new-password"
                  data-ocid="signup.password_input"
                />
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    clearFieldError("confirmPassword");
                  }}
                  leftIcon={<Lock className="w-4 h-4" />}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  }
                  error={errors.confirmPassword}
                  autoComplete="new-password"
                  data-ocid="signup.confirm_password_input"
                />

                {/* PIN section with divider */}
                <div className="pt-1 pb-0.5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex-1 h-px bg-border" />
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-display font-medium">
                      <Shield className="w-3.5 h-3.5 text-primary" />
                      Transaction Security
                    </div>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  <div className="space-y-4">
                    <Input
                      label="Transaction PIN"
                      type="password"
                      inputMode="numeric"
                      placeholder="4-digit PIN"
                      maxLength={4}
                      value={pin}
                      onChange={(e) => {
                        const val = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 4);
                        setPin(val);
                        clearFieldError("pin");
                      }}
                      leftIcon={<Shield className="w-4 h-4" />}
                      error={errors.pin}
                      autoComplete="new-password"
                      data-ocid="signup.pin_input"
                    />
                    <Input
                      label="Confirm Transaction PIN"
                      type="password"
                      inputMode="numeric"
                      placeholder="Re-enter 4-digit PIN"
                      maxLength={4}
                      value={confirmPin}
                      onChange={(e) => {
                        const val = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 4);
                        setConfirmPin(val);
                        clearFieldError("confirmPin");
                      }}
                      leftIcon={<Shield className="w-4 h-4" />}
                      error={errors.confirmPin}
                      autoComplete="new-password"
                      data-ocid="signup.confirm_pin_input"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2 font-body">
                    You'll need this PIN every time you send money.
                  </p>
                </div>

                {errors.form && (
                  <motion.p
                    className="text-sm text-destructive flex items-center gap-1.5"
                    data-ocid="signup.error_state"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0" />
                    {errors.form}
                  </motion.p>
                )}

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  loading={loading}
                  className="mt-2"
                  data-ocid="signup.submit_button"
                >
                  {loading ? "Creating account…" : "Create account"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-3 text-muted-foreground">
                    Already have an account?
                  </span>
                </div>
              </div>

              <Link
                to="/login"
                data-ocid="signup.login_link"
                className="block w-full"
              >
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  size="md"
                  className="font-semibold"
                >
                  Sign in instead
                </Button>
              </Link>
            </Card>
          </motion.div>

          {/* Footer disclaimer */}
          <motion.p
            className="text-center text-xs text-muted-foreground leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            Starting balance:{" "}
            <span className="text-primary font-medium">₹1,000 virtual</span>.
            Simulation only — no real transactions.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
