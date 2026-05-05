import { useLocation, useNavigate } from "@tanstack/react-router";
import html2canvas from "html2canvas";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  History,
  Home,
  Share2,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Transaction } from "../backend.d.ts";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ProtectedRoute } from "../components/ProtectedRoute";

function formatDateTime(ts: bigint): string {
  const ms = Number(ts / BigInt(1_000_000));
  return new Date(ms).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function playSuccessChime() {
  try {
    const ctx = new AudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      const startTime = ctx.currentTime + i * 0.12;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
      osc.start(startTime);
      osc.stop(startTime + 0.42);
    });
  } catch {
    // AudioContext not available
  }
}

function detailRows(tx: Transaction) {
  return [
    { label: "To", value: tx.receiverId },
    { label: "Transaction ID", value: tx.txId },
    { label: "Date & Time", value: formatDateTime(tx.timestamp) },
    { label: "Status", value: tx.status },
  ];
}

export default function ReceiptPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const receiptRef = useRef<HTMLDivElement>(null);
  const [capturing, setCapturing] = useState(false);
  const [chimeReady, setChimeReady] = useState(false);

  // Transaction arrives via navigation state
  const tx = (location.state as unknown as Transaction | undefined)?.txId
    ? (location.state as unknown as Transaction)
    : undefined;

  const amountNum = tx ? Number(tx.amount) : 0;

  useEffect(() => {
    if (!tx) return;
    const timer = setTimeout(() => {
      playSuccessChime();
      setChimeReady(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [tx]);

  const captureReceipt = async (): Promise<Blob | null> => {
    if (!receiptRef.current) return null;
    try {
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: "#1a1a2e",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      return await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/png"),
      );
    } catch {
      return null;
    }
  };

  const handleScreenshot = async () => {
    setCapturing(true);
    try {
      const blob = await captureReceipt();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fpay-demo-receipt-${tx?.txId ?? "receipt"}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setCapturing(false);
    }
  };

  const handleShare = async () => {
    setCapturing(true);
    try {
      const blob = await captureReceipt();
      if (blob && navigator.share) {
        const file = new File([blob], "fpay-demo-receipt.png", {
          type: "image/png",
        });
        const canShareFile = navigator.canShare?.({ files: [file] });
        if (canShareFile) {
          await navigator.share({
            title: "FPay Demo Receipt",
            text: `DEMO PAYMENT: ₹${amountNum.toFixed(2)} sent to ${tx?.receiverId}. THIS IS A DEMO – NOT REAL.`,
            files: [file],
          });
          return;
        }
      }
      if (navigator.share && tx) {
        await navigator.share({
          title: "FPay Demo Receipt",
          text: `DEMO PAYMENT: ₹${amountNum.toFixed(2)} sent to ${tx.receiverId} on ${formatDateTime(tx.timestamp)}. THIS IS A DEMO – NO REAL MONEY TRANSFERRED.`,
        });
      } else {
        await handleScreenshot();
      }
    } catch {
      // user cancelled
    } finally {
      setCapturing(false);
    }
  };

  if (!tx) {
    return (
      <ProtectedRoute>
        <div
          className="min-h-screen bg-background flex flex-col items-center justify-center px-4"
          data-ocid="receipt.page"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Zap className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-display font-semibold">
              No receipt found
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Complete a transaction to see your receipt here.
            </p>
            <Button
              onClick={() => navigate({ to: "/" })}
              icon={<Home className="w-4 h-4" />}
            >
              Go to Dashboard
            </Button>
          </motion.div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div
        className="min-h-screen bg-background flex flex-col items-center pb-10 px-4"
        data-ocid="receipt.page"
      >
        {/* Top nav */}
        <div className="w-full max-w-sm pt-4 pb-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="p-2 rounded-lg hover:bg-muted transition-smooth"
            aria-label="Back to Dashboard"
            data-ocid="receipt.back_button"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <span className="text-sm font-display font-semibold text-muted-foreground tracking-wide uppercase">
            Payment Receipt
          </span>
        </div>

        <div className="w-full max-w-sm space-y-5">
          {/* Receipt card — captured by html2canvas */}
          <motion.div
            ref={receiptRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.34, 1.26, 0.64, 1] }}
          >
            <Card
              variant="elevated"
              padding="lg"
              className="space-y-5 relative overflow-hidden"
              data-ocid="receipt.card"
            >
              {/* Ambient glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

              {/* Success icon + amount */}
              <div className="flex flex-col items-center gap-3 pt-4 relative">
                <AnimatePresence>
                  {chimeReady && (
                    <motion.div
                      key="check"
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 18,
                      }}
                      className="w-20 h-20 rounded-full gradient-success flex items-center justify-center glow-cyan"
                      data-ocid="receipt.success_state"
                    >
                      <CheckCircle2 className="w-11 h-11 text-chart-2" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg font-display font-bold text-foreground"
                >
                  Payment Successful
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="text-4xl font-display font-bold text-chart-2"
                >
                  ₹
                  {amountNum.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/50 glow-amber"
                  data-ocid="receipt.demo_badge"
                >
                  <Zap className="w-3.5 h-3.5 text-accent" />
                  <span className="text-sm text-accent font-display font-bold tracking-widest uppercase">
                    DEMO PAYMENT
                  </span>
                  <Zap className="w-3.5 h-3.5 text-accent" />
                </motion.div>
              </div>

              {/* Details table */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}
                className="space-y-3 border-t border-border pt-4"
              >
                {detailRows(tx).map(({ label, value }, i) => (
                  <div key={label} className="flex justify-between gap-4">
                    <span className="text-sm text-muted-foreground font-body flex-shrink-0">
                      {label}
                    </span>
                    <span
                      className="text-sm text-foreground font-display font-medium text-right break-all"
                      data-ocid={`receipt.detail.${i + 1}`}
                    >
                      {label === "Status" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-chart-2/10 text-chart-2 text-xs font-semibold">
                          ✓ {value}
                        </span>
                      ) : (
                        value
                      )}
                    </span>
                  </div>
                ))}
              </motion.div>

              {/* Disclaimer box */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75 }}
                className="bg-accent/10 border border-accent/30 rounded-xl p-4 text-center space-y-1"
                data-ocid="receipt.disclaimer"
              >
                <p className="text-xs text-accent font-display font-bold tracking-wide uppercase">
                  ⚠ This is a simulation-only demo transaction
                </p>
                <p className="text-xs text-muted-foreground font-body">
                  No real money was transferred. FPay is for educational
                  purposes only.
                </p>
              </motion.div>
            </Card>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-3"
          >
            <Button
              fullWidth
              size="lg"
              variant="primary"
              icon={<Share2 className="w-5 h-5" />}
              onClick={handleShare}
              loading={capturing}
              data-ocid="receipt.share_button"
            >
              Share Receipt
            </Button>

            <Button
              fullWidth
              size="lg"
              variant="secondary"
              icon={<Download className="w-5 h-5" />}
              onClick={handleScreenshot}
              loading={capturing}
              data-ocid="receipt.screenshot_button"
            >
              Save as Image
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="md"
                fullWidth
                icon={<History className="w-4 h-4" />}
                onClick={() => navigate({ to: "/history" })}
                data-ocid="receipt.history_button"
              >
                History
              </Button>
              <Button
                size="md"
                fullWidth
                icon={<Home className="w-4 h-4" />}
                onClick={() => navigate({ to: "/" })}
                data-ocid="receipt.home_button"
              >
                Dashboard
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
