import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  FlipHorizontal2,
  Keyboard,
  Loader2,
  ScanLine,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import type { UserPublic } from "../backend.d.ts";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useBackend } from "../hooks/useBackend";
import { useQRScanner } from "../lib/qr-code-shim";
import { useAuthStore } from "../store/authStore";

type ScanMode = "camera" | "manual";

export default function ScanQRPage() {
  const session = useAuthStore((s) => s.session);
  const navigate = useNavigate();
  const { getUser } = useBackend();
  const [mode, setMode] = useState<ScanMode>("camera");
  const [manualId, setManualId] = useState("");
  const [scanned, setScanned] = useState<string | null>(null);
  const [resolvedUser, setResolvedUser] = useState<UserPublic | null>(null);
  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState("");

  const {
    qrResults,
    isScanning,
    isActive,
    isSupported,
    error,
    isLoading,
    canStartScanning,
    startScanning,
    stopScanning,
    switchCamera,
    clearResults,
    videoRef,
    canvasRef,
  } = useQRScanner({
    facingMode: "environment",
    scanInterval: 100,
    maxResults: 3,
  });

  // Auto-start camera when entering camera mode
  useEffect(() => {
    if (mode === "camera" && canStartScanning) {
      startScanning();
    }
    return () => {
      stopScanning();
    };
  }, [mode, canStartScanning, startScanning, stopScanning]);

  // Resolve scanned QR data against backend
  const resolveId = useCallback(
    async (id: string) => {
      setResolving(true);
      setResolveError("");
      setResolvedUser(null);
      try {
        const user = await getUser(id.trim());
        if (user) {
          setResolvedUser(user);
        } else {
          setResolveError(
            "No account found for this QR code. Ask the recipient to share their ID.",
          );
        }
      } catch {
        setResolveError(
          "Could not look up user. Check connection and try again.",
        );
      } finally {
        setResolving(false);
      }
    },
    [getUser],
  );

  // Handle first QR result
  useEffect(() => {
    if (qrResults.length > 0 && !scanned) {
      const decoded = qrResults[0].data;
      setScanned(decoded);
      stopScanning();
      resolveId(decoded);
    }
  }, [qrResults, scanned, stopScanning, resolveId]);

  const handleProceed = useCallback(() => {
    const id = resolvedUser?.userId ?? scanned;
    if (id?.trim()) {
      navigate({ to: "/send", search: { receiver: id.trim() } });
    }
  }, [navigate, resolvedUser, scanned]);

  const handleManualProceed = async () => {
    if (!manualId.trim()) return;
    await resolveId(manualId.trim());
    // Proceed even if not found — let send page handle it
    navigate({ to: "/send", search: { receiver: manualId.trim() } });
  };

  const handleRescan = () => {
    setScanned(null);
    setResolvedUser(null);
    setResolveError("");
    clearResults();
    startScanning();
  };

  const isMobile =
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );

  return (
    <ProtectedRoute>
      <div
        className="min-h-screen bg-background flex flex-col items-center py-8 px-4"
        data-ocid="scanqr.page"
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
                stopScanning();
                navigate({ to: "/" });
              }}
              className="p-2 rounded-lg hover:bg-muted transition-smooth"
              data-ocid="scanqr.back_button"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">
                Scan QR Code
              </h1>
              <p className="text-xs text-muted-foreground">
                Point camera at recipient's QR code
              </p>
            </div>
          </div>

          {/* Mode toggle */}
          <div className="flex gap-1 p-1 bg-muted/50 rounded-xl border border-border">
            <button
              type="button"
              onClick={() => {
                setMode("camera");
                setResolveError("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-display font-semibold transition-smooth ${
                mode === "camera"
                  ? "bg-primary text-primary-foreground shadow-elevated"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid="scanqr.camera_tab"
            >
              <Camera className="w-4 h-4" />
              Camera
            </button>
            <button
              type="button"
              onClick={() => {
                stopScanning();
                setMode("manual");
                setResolveError("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-display font-semibold transition-smooth ${
                mode === "manual"
                  ? "bg-primary text-primary-foreground shadow-elevated"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid="scanqr.manual_tab"
            >
              <Keyboard className="w-4 h-4" />
              Manual
            </button>
          </div>

          <AnimatePresence mode="wait">
            {mode === "camera" ? (
              <motion.div
                key="camera"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  variant="elevated"
                  padding="lg"
                  className="flex flex-col items-center gap-4"
                >
                  {/* Scan success state */}
                  {scanned ? (
                    <motion.div
                      className="w-full flex flex-col items-center gap-4 py-4"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      {resolving ? (
                        <div className="flex flex-col items-center gap-3 py-4">
                          <Loader2 className="w-10 h-10 text-primary animate-spin" />
                          <p className="text-sm text-muted-foreground">
                            Verifying receiver…
                          </p>
                        </div>
                      ) : resolveError ? (
                        <>
                          <div className="w-16 h-16 rounded-full bg-destructive/15 border-2 border-destructive flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-destructive" />
                          </div>
                          <div className="text-center space-y-1">
                            <p className="font-display font-bold text-foreground">
                              Receiver Not Found
                            </p>
                            <p
                              className="text-sm text-destructive text-center"
                              data-ocid="scanqr.error_state"
                            >
                              {resolveError}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            onClick={handleRescan}
                            fullWidth
                            data-ocid="scanqr.rescan_button"
                          >
                            Try Again
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 rounded-full bg-chart-2/20 border-2 border-chart-2 flex items-center justify-center success-pop">
                            <CheckCircle2 className="w-8 h-8 text-chart-2" />
                          </div>
                          <div className="text-center space-y-1">
                            <p className="font-display font-bold text-foreground">
                              QR Code Scanned!
                            </p>
                            {resolvedUser && (
                              <div className="flex items-center justify-center gap-2 py-1 px-3 rounded-full bg-chart-2/10 border border-chart-2/30">
                                <User className="w-3.5 h-3.5 text-chart-2" />
                                <span className="text-sm text-chart-2 font-display font-semibold">
                                  {resolvedUser.name}
                                </span>
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground font-mono break-all">
                              {scanned}
                            </p>
                          </div>
                          <div className="flex gap-3 w-full">
                            <Button
                              variant="secondary"
                              onClick={handleRescan}
                              className="flex-1"
                              data-ocid="scanqr.rescan_button"
                            >
                              Rescan
                            </Button>
                            <Button
                              onClick={handleProceed}
                              className="flex-1"
                              data-ocid="scanqr.proceed_button"
                            >
                              Proceed
                            </Button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ) : (
                    <>
                      {/* Camera viewport */}
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-primary/30 bg-muted/40">
                        {/* Scanning frame corners */}
                        <div className="absolute inset-0 z-10 pointer-events-none">
                          {[
                            "top-4 left-4 border-t-2 border-l-2",
                            "top-4 right-4 border-t-2 border-r-2",
                            "bottom-4 left-4 border-b-2 border-l-2",
                            "bottom-4 right-4 border-b-2 border-r-2",
                          ].map((classes) => (
                            <div
                              key={classes}
                              className={`absolute w-8 h-8 border-primary rounded-sm ${classes}`}
                            />
                          ))}
                          {isScanning && (
                            <motion.div
                              className="absolute left-4 right-4 h-0.5 bg-primary/70"
                              style={{
                                boxShadow: "0 0 8px oklch(0.72 0.22 200 / 0.8)",
                              }}
                              animate={{ top: ["15%", "85%", "15%"] }}
                              transition={{
                                duration: 2.5,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                              }}
                            />
                          )}
                        </div>

                        <video
                          ref={videoRef}
                          className="w-full h-full object-cover"
                          playsInline
                          muted
                        />
                        <canvas ref={canvasRef} className="hidden" />

                        {!isActive && !isLoading && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted/60 backdrop-blur-sm">
                            {isSupported === false ? (
                              <>
                                <AlertCircle className="w-12 h-12 text-destructive/60" />
                                <p className="text-sm text-muted-foreground text-center px-4">
                                  Camera not supported in this browser.
                                </p>
                              </>
                            ) : (
                              <>
                                <ScanLine className="w-12 h-12 text-primary/40" />
                                <p className="text-sm text-muted-foreground text-center px-4">
                                  Tap start to activate camera
                                </p>
                              </>
                            )}
                          </div>
                        )}
                        {isLoading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-muted/60">
                            <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                          </div>
                        )}
                      </div>

                      {error && (
                        <div
                          className="w-full flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30"
                          data-ocid="scanqr.error_state"
                        >
                          <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-destructive">
                            {error.message}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-3 w-full">
                        {!isActive ? (
                          <Button
                            fullWidth
                            onClick={startScanning}
                            disabled={!canStartScanning}
                            loading={isLoading}
                            icon={<Camera className="w-4 h-4" />}
                            data-ocid="scanqr.start_button"
                          >
                            Start Camera
                          </Button>
                        ) : (
                          <>
                            <Button
                              variant="secondary"
                              onClick={stopScanning}
                              className="flex-1"
                              data-ocid="scanqr.stop_button"
                            >
                              Stop
                            </Button>
                            {isMobile && (
                              <Button
                                variant="outline"
                                onClick={switchCamera}
                                icon={<FlipHorizontal2 className="w-4 h-4" />}
                                data-ocid="scanqr.switch_camera_button"
                              >
                                Flip
                              </Button>
                            )}
                          </>
                        )}
                      </div>

                      <p className="text-xs text-muted-foreground text-center">
                        Logged in as:{" "}
                        <span className="text-foreground font-mono">
                          {session?.userId}
                        </span>
                      </p>
                    </>
                  )}
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="manual"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  variant="elevated"
                  padding="lg"
                  className="flex flex-col gap-5"
                >
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                      <Keyboard className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enter a User ID or phone number to send money
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="manual-id-input"
                      className="text-sm font-display font-medium text-foreground"
                    >
                      User ID or Phone Number
                    </label>
                    <input
                      id="manual-id-input"
                      type="text"
                      placeholder="User ID (FPXXXXXXXX) or phone number"
                      value={manualId}
                      onChange={(e) => setManualId(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleManualProceed()
                      }
                      className="w-full h-12 bg-muted/50 border border-input rounded-lg px-4 text-foreground placeholder:text-muted-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                      data-ocid="scanqr.id_input"
                    />
                  </div>
                  {resolveError && (
                    <div
                      className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30"
                      data-ocid="scanqr.error_state"
                    >
                      <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-destructive">{resolveError}</p>
                    </div>
                  )}
                  <Button
                    fullWidth
                    onClick={handleManualProceed}
                    disabled={!manualId.trim()}
                    loading={resolving}
                    icon={<ScanLine className="w-4 h-4" />}
                    data-ocid="scanqr.proceed_button"
                  >
                    Proceed to Send
                  </Button>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}
