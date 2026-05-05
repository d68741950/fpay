import { Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Phone, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { useBackend } from "../hooks/useBackend";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useBackend();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
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

  return (
    <div className="flex-1 flex flex-col" data-ocid="login.page">
      {/* Decorative gradient blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent/8 blur-3xl" />
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
              Demo Payment Simulator
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
                  Sign in
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your phone number and password
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4" noValidate>
                <Input
                  label="Phone Number"
                  type="tel"
                  inputMode="numeric"
                  placeholder="Enter 10-digit number"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (error) setError("");
                  }}
                  leftIcon={<Phone className="w-4 h-4" />}
                  autoComplete="tel"
                  data-ocid="login.phone_input"
                />
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
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
                  autoComplete="current-password"
                  data-ocid="login.password_input"
                />

                {error && (
                  <motion.p
                    className="text-sm text-destructive flex items-center gap-1.5"
                    data-ocid="login.error_state"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive flex-shrink-0" />
                    {error}
                  </motion.p>
                )}

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  loading={loading}
                  className="mt-2"
                  data-ocid="login.submit_button"
                >
                  {loading ? "Signing in…" : "Sign in"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-3 text-muted-foreground">
                    Don't have an account?
                  </span>
                </div>
              </div>

              <Link
                to="/signup"
                data-ocid="login.signup_link"
                className="block w-full"
              >
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  size="md"
                  className="font-semibold"
                >
                  Create account
                </Button>
              </Link>
            </Card>
          </motion.div>

          {/* Footer disclaimer */}
          <motion.p
            className="text-center text-xs text-muted-foreground leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            This app is for simulation only.{" "}
            <span className="text-accent font-medium">No real money</span> is
            involved.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
