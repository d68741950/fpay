import jsQR from "jsqr";
import { useCallback, useEffect, useRef, useState } from "react";

export interface QRResult {
  data: string;
  format: string;
}

export interface UseQRScannerOptions {
  facingMode?: "environment" | "user";
  scanInterval?: number;
  maxResults?: number;
}

export interface UseQRScannerReturn {
  qrResults: QRResult[];
  isScanning: boolean;
  isActive: boolean;
  isSupported: boolean | null;
  error: Error | null;
  isLoading: boolean;
  canStartScanning: boolean;
  startScanning: () => void;
  stopScanning: () => void;
  switchCamera: () => void;
  clearResults: () => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export function useQRScanner(
  options?: UseQRScannerOptions,
): UseQRScannerReturn {
  const {
    facingMode = "environment",
    scanInterval = 150,
    maxResults = 3,
  } = options ?? {};

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [qrResults, setQrResults] = useState<QRResult[]>([]);
  const [currentFacing, setCurrentFacing] = useState(facingMode);

  const stopInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startInterval = useCallback(() => {
    stopInterval();
    intervalRef.current = setInterval(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < video.HAVE_ENOUGH_DATA)
        return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code) {
        setQrResults((prev) => {
          const alreadyFound = prev.some((r) => r.data === code.data);
          if (alreadyFound || prev.length >= maxResults) return prev;
          return [...prev, { data: code.data, format: "QR_CODE" }];
        });
      }
    }, scanInterval);
  }, [scanInterval, maxResults, stopInterval]);

  const startScanning = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(new Error("Camera not supported in this browser."));
      return;
    }
    setIsLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: currentFacing },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsActive(true);
      setError(null);
      startInterval();
    } catch (e) {
      setError(e instanceof Error ? e : new Error("Camera access denied"));
    } finally {
      setIsLoading(false);
    }
  }, [currentFacing, startInterval]);

  const stopScanning = useCallback(() => {
    stopInterval();
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      for (const t of stream.getTracks()) t.stop();
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
  }, [stopInterval]);

  const switchCamera = useCallback(() => {
    const next = currentFacing === "environment" ? "user" : "environment";
    setCurrentFacing(next);
    if (isActive) {
      stopScanning();
      // Re-start after brief delay to allow stream teardown
      setTimeout(() => startScanning(), 300);
    }
  }, [currentFacing, isActive, startScanning, stopScanning]);

  const clearResults = useCallback(() => setQrResults([]), []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, [stopScanning]);

  return {
    qrResults,
    isScanning: isActive,
    isActive,
    isSupported: typeof navigator !== "undefined" && !!navigator.mediaDevices,
    error,
    isLoading,
    canStartScanning: !isActive && !isLoading,
    startScanning,
    stopScanning,
    switchCamera,
    clearResults,
    videoRef,
    canvasRef,
  };
}
