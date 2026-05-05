import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check, Copy, Download, QrCode, Share2 } from "lucide-react";
import { motion } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import { useCallback, useRef, useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useAuthStore } from "../store/authStore";

export default function MyQRPage() {
  const session = useAuthStore((s) => s.session);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const qrContainerRef = useRef<HTMLDivElement>(null);

  const handleCopyId = useCallback(async () => {
    if (!session?.userId) return;
    try {
      await navigator.clipboard.writeText(session.userId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback: select text
    }
  }, [session?.userId]);

  const handleShare = useCallback(async () => {
    if (!session) return;
    const text = `Pay me on FPay!\nUser ID: ${session.userId}\nPhone: ${session.phone}\n\n⚠️ DEMO — No real transactions.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "FPay QR Code", text });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [session]);

  const handleDownload = useCallback(() => {
    if (!qrContainerRef.current) return;
    const svg = qrContainerRef.current.querySelector("svg");
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const svgBlob = new Blob([svgStr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fpay-qr-${session?.userId ?? "code"}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [session?.userId]);

  return (
    <ProtectedRoute>
      <div
        className="min-h-screen bg-background flex flex-col items-center py-8 px-4"
        data-ocid="myqr.page"
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
              onClick={() => navigate({ to: "/" })}
              className="p-2 rounded-lg hover:bg-muted transition-smooth"
              data-ocid="myqr.back_button"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">
                My QR Code
              </h1>
              <p className="text-xs text-muted-foreground">
                Let others scan to send you money
              </p>
            </div>
          </div>

          {/* QR card */}
          <Card
            variant="elevated"
            padding="lg"
            className="flex flex-col items-center gap-5"
          >
            {/* Instruction badge */}
            <div className="flex items-center gap-2 text-primary">
              <QrCode className="w-4 h-4" />
              <span className="text-sm font-display font-semibold">
                Scan to pay {session?.name}
              </span>
            </div>

            {/* QR code container */}
            <motion.div
              ref={qrContainerRef}
              className="relative p-4 bg-card rounded-2xl border border-primary/30 glow-cyan"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 18,
                delay: 0.15,
              }}
              data-ocid="myqr.qr_code"
            >
              {session && (
                <QRCodeSVG
                  value={`fpay:${session.userId}`}
                  size={200}
                  level="M"
                  fgColor="oklch(0.93 0.008 265)"
                  bgColor="oklch(0.18 0.022 265)"
                />
              )}
              {/* Corner accent marks */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary rounded-tl-sm pointer-events-none" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary rounded-tr-sm pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary rounded-bl-sm pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary rounded-br-sm pointer-events-none" />
            </motion.div>

            {/* User info */}
            <motion.div
              className="text-center space-y-1 w-full"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <p className="font-display font-bold text-lg text-foreground">
                {session?.name}
              </p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-sm text-muted-foreground font-mono tracking-wider">
                  {session?.userId}
                </p>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="p-1 rounded-md hover:bg-muted transition-smooth"
                  aria-label="Copy User ID"
                  data-ocid="myqr.copy_button"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-chart-2" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </button>
              </div>
              <p className="text-sm text-muted-foreground">{session?.phone}</p>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              className="flex gap-3 w-full"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
            >
              <Button
                variant="secondary"
                onClick={handleDownload}
                icon={<Download className="w-4 h-4" />}
                className="flex-1"
                data-ocid="myqr.download_button"
              >
                Download
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                icon={<Share2 className="w-4 h-4" />}
                className="flex-1"
                data-ocid="myqr.share_button"
              >
                Share
              </Button>
            </motion.div>

            {/* Demo disclaimer */}
            <div className="w-full p-3 rounded-lg bg-accent/10 border border-accent/30 text-center">
              <p className="text-xs text-accent font-display font-semibold tracking-wide">
                ⚠ DEMO QR CODE — NO REAL PAYMENT
              </p>
            </div>
          </Card>

          {/* How to use */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card variant="default" padding="md" className="space-y-3">
              <p className="text-sm font-display font-semibold text-foreground">
                How to use
              </p>
              {[
                "Ask someone to open FPay and tap Scan QR",
                "They point their camera at your QR code",
                "They enter the amount and send",
              ].map((step, i) => (
                <div key={step} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-display font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-xs text-muted-foreground">{step}</p>
                </div>
              ))}
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}
