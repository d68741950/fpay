import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  IndianRupee,
  SendHorizontal,
  Shield,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Transaction } from "../backend.d.ts";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useBackend } from "../hooks/useBackend";
import { useAuthStore } from "../store/authStore";

type Step = "form" | "pin";

export default function SendMoneyPage() {
  const session = useAuthStore((s) => s.session);
  const { sendMoney, getUser } = useBackend();
  const navigate = useNavigate();

  const search = useSearch({ strict: false }) as { receiver?: string };

  const [step, setStep] = useState<Step>("form");
  const [receiver, setReceiver] = useState(search?.receiver ?? "");
  const [receiverName, setReceiverName] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  const pinInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill and validate receiver from QR scan
  useEffect(() => {
    if (search?.receiver) {
      setReceiver(search.receiver);
      resolveReceiver(search.receiver);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search?.receiver]);

  // Focus PIN input when entering pin step
  useEffect(() => {
    if (step === "pin") {
      setTimeout(() => pinInputRef.current?.focus(), 100);
    }
  }, [step]);

  const resolveReceiver = async (id: string) => {
    if (!id.trim()) {
      setReceiverName(null);
      return;
    }
    setResolving(true);
    try {
      const user = await getUser(id.trim());
      if (user) {
        setReceiverName(user.name);
        setError("");
      } else {
        setReceiverName(null);
      }
    } catch {
      setReceiverName(null);
    } finally {
      setResolving(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiver.trim()) {
      setError("Please enter a receiver phone number or User ID.");
      return;
    }
    const amountNum = Number.parseFloat(amount);
    if (Number.isNaN(amountNum) || amountNum <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (session && amountNum > session.balance) {
      setError(
        `Insufficient balance. Available: ₹${session.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}.`,
      );
      return;
    }
    setError("");
    setPin("");
    setStep("pin");
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin || pin.length !== 4) {
      setError("Enter your 4-digit transaction PIN.");
      return;
    }

    setProcessing(true);
    setError("");
    setProcessingStep(0);

    await new Promise((r) => setTimeout(r, 800));
    setProcessingStep(1);
    await new Promise((r) => setTimeout(r, 1000));
    setProcessingStep(2);
    await new Promise((r) => setTimeout(r, 400));

    const amountNum = Number.parseFloat(amount);
    const result = await sendMoney(
      session!.userId,
      receiver.trim(),
      amountNum,
      pin,
      note || undefined,
    );
    setProcessing(false);

    if (result.success) {
      navigate({
        to: "/receipt",
        state: result.transaction as unknown as true,
      });
    } else {
      // On invalid PIN, stay on pin step and show error
      if (result.error.includes("Incorrect PIN")) {
        setPin("");
        setError(result.error);
        setTimeout(() => pinInputRef.current?.focus(), 50);
      } else {
        // Other errors — go back to form
        setStep("form");
        setError(result.error);
      }
    }
  };

  const processingLabels = [
    "Authenticating…",
    "Transferring funds…",
    "Confirming transaction…",
  ];

  return (
    <ProtectedRoute>
      <div
        className="min-h-screen bg-background flex flex-col items-center py-8 px-4"
        data-ocid="send.page"
      >
        <motion.div
          className="w-full max-w-sm space-y-6"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.34, 1.2, 0.64, 1] }}
        >
          {/* Header */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (step === "pin" && !processing) {
                  setStep("form");
                  setError("");
                } else {
                  navigate({ to: "/" });
                }
              }}
              className="p-2 rounded-lg hover:bg-muted transition-smooth"
              data-ocid="send.back_button"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">
                {step === "pin" ? "Confirm with PIN" : "Send Money"}
              </h1>
              <p className="text-xs text-muted-foreground">
                DEMO — no real money moves
              </p>
            </div>
          </div>

          {/* Balance pill */}
          {session && (
            <motion.div
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/25 w-fit"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <IndianRupee className="w-3.5 h-3.5 text-primary" />
              <span className="text-sm font-display font-semibold text-primary">
                {session.balance.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                available
              </span>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === "form" ? (
              /* ── FORM STEP ── */
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <Card variant="elevated" padding="lg">
                  <form onSubmit={handleFormSubmit} className="space-y-5">
                    {/* Receiver input with inline lookup */}
                    <div className="space-y-1.5">
                      <Input
                        label="Receiver (Phone or User ID)"
                        placeholder="Phone number or FPXXXXXXXX"
                        value={receiver}
                        onChange={(e) => {
                          setReceiver(e.target.value);
                          setReceiverName(null);
                          setError("");
                        }}
                        onBlur={() => resolveReceiver(receiver)}
                        leftIcon={<User className="w-4 h-4" />}
                        data-ocid="send.receiver_input"
                      />
                      <AnimatePresence>
                        {resolving && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-xs text-muted-foreground pl-1"
                            data-ocid="send.receiver_loading"
                          >
                            Looking up receiver…
                          </motion.p>
                        )}
                        {receiverName && !resolving && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 pl-1"
                            data-ocid="send.receiver_resolved"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-chart-2 flex-shrink-0" />
                            <span className="text-xs text-chart-2 font-display font-semibold">
                              {receiverName}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <Input
                      label="Amount (₹)"
                      type="number"
                      placeholder="0.00"
                      min="1"
                      step="0.01"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setError("");
                      }}
                      leftIcon={<IndianRupee className="w-4 h-4" />}
                      data-ocid="send.amount_input"
                    />
                    <Input
                      label="Note (optional)"
                      placeholder="What's this for?"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      data-ocid="send.note_input"
                    />

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          data-ocid="send.error_state"
                        >
                          <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-destructive">{error}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Button
                      type="submit"
                      fullWidth
                      size="lg"
                      icon={<SendHorizontal className="w-5 h-5" />}
                      data-ocid="send.submit_button"
                    >
                      Continue to PIN
                    </Button>
                  </form>
                </Card>
              </motion.div>
            ) : (
              /* ── PIN STEP ── */
              <motion.div
                key="pin"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
              >
                <Card variant="elevated" padding="lg">
                  {/* Summary */}
                  <div className="flex items-center justify-between mb-5 p-3 rounded-xl bg-primary/8 border border-primary/20">
                    <div>
                      <p className="text-xs text-muted-foreground font-body">
                        Sending to
                      </p>
                      <p className="text-sm font-display font-semibold text-foreground truncate max-w-[140px]">
                        {receiverName ?? receiver}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground font-body">
                        Amount
                      </p>
                      <p className="text-lg font-display font-bold text-primary">
                        ₹
                        {Number(amount).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handlePinSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Input
                        ref={pinInputRef}
                        label="Enter Transaction PIN to confirm"
                        type="password"
                        inputMode="numeric"
                        placeholder="••••"
                        maxLength={4}
                        value={pin}
                        onChange={(e) => {
                          const val = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 4);
                          setPin(val);
                          setError("");
                        }}
                        leftIcon={<Shield className="w-4 h-4" />}
                        data-ocid="send.pin_input"
                      />
                      {/* PIN dot indicators */}
                      <div className="flex items-center justify-center gap-3 py-1">
                        {[0, 1, 2, 3].map((i) => (
                          <motion.div
                            key={i}
                            className="w-3 h-3 rounded-full border-2"
                            animate={{
                              backgroundColor:
                                i < pin.length
                                  ? "oklch(0.72 0.22 200)"
                                  : "transparent",
                              borderColor:
                                i < pin.length
                                  ? "oklch(0.72 0.22 200)"
                                  : "oklch(0.4 0.025 265)",
                              scale: i < pin.length ? 1.15 : 1,
                            }}
                            transition={{ duration: 0.15 }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30"
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          data-ocid="send.pin_error_state"
                        >
                          <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-destructive">{error}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Processing animation */}
                    <AnimatePresence>
                      {processing && (
                        <motion.div
                          className="flex flex-col items-center gap-4 py-4"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          data-ocid="send.loading_state"
                        >
                          <div className="relative flex items-center justify-center">
                            <motion.div
                              className="absolute w-20 h-20 rounded-full border-2 border-primary/30"
                              animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                              transition={{
                                duration: 1.2,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeOut",
                              }}
                            />
                            <motion.div
                              className="absolute w-14 h-14 rounded-full border-2 border-primary/50"
                              animate={{ scale: [1, 1.4], opacity: [0.8, 0] }}
                              transition={{
                                duration: 1.2,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeOut",
                                delay: 0.3,
                              }}
                            />
                            <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                              <motion.div
                                className="w-5 h-5 rounded-full border-2 border-primary/30 border-t-primary"
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 0.8,
                                  repeat: Number.POSITIVE_INFINITY,
                                  ease: "linear",
                                }}
                              />
                            </div>
                          </div>
                          <div className="text-center space-y-1">
                            <motion.p
                              key={processingStep}
                              className="text-sm font-display font-semibold text-primary"
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              {processingLabels[processingStep]}
                            </motion.p>
                            <p className="text-xs text-muted-foreground">
                              Please wait…
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {processingLabels.map((label, i) => (
                              <motion.div
                                key={label}
                                className="w-2 h-2 rounded-full"
                                animate={{
                                  backgroundColor:
                                    i <= processingStep
                                      ? "oklch(0.72 0.22 200)"
                                      : "oklch(0.28 0.025 265)",
                                  scale: i === processingStep ? 1.3 : 1,
                                }}
                                transition={{ duration: 0.3 }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {!processing && (
                      <Button
                        type="submit"
                        fullWidth
                        size="lg"
                        icon={<Shield className="w-5 h-5" />}
                        data-ocid="send.confirm_button"
                        disabled={pin.length !== 4}
                      >
                        Confirm & Send
                      </Button>
                    )}
                  </form>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Amount quick-pick — only on form step */}
          {step === "form" && !processing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              <p className="text-xs text-muted-foreground mb-2 font-display font-medium">
                Quick amounts
              </p>
              <div className="flex gap-2 flex-wrap">
                {[100, 250, 500, 1000, 2000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(String(val))}
                    className="px-3 py-1.5 text-xs font-display font-semibold rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-smooth"
                    data-ocid={`send.quick_amount.${val}`}
                  >
                    ₹{val.toLocaleString("en-IN")}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 border border-border">
            <CheckCircle2 className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              This is a simulation. No real currency is transferred.
            </p>
          </div>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}

// Suppress unused Transaction import warning — used in navigate state
type _T = Transaction;
