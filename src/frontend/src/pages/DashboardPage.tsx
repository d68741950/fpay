import { useNavigate } from "@tanstack/react-router";
import {
  ArrowDownLeft,
  ArrowUpRight,
  History,
  LogOut,
  QrCode,
  ScanLine,
  SendHorizontal,
  User,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Transaction } from "../backend.d.ts";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useBackend } from "../hooks/useBackend";
import { useAuthStore } from "../store/authStore";

function formatBalance(amount: number): string {
  return amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatTxTime(ts: bigint): string {
  // timestamp is nanoseconds from backend
  const ms = Number(ts / BigInt(1_000_000));
  const d = new Date(ms);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const ACTIONS = [
  {
    label: "Send Money",
    icon: <SendHorizontal className="w-6 h-6" />,
    to: "/send",
    ocid: "dashboard.send_button",
    color: "text-primary",
    bg: "bg-primary/10 hover:bg-primary/20 border-primary/20 hover:border-primary/50",
  },
  {
    label: "Scan QR",
    icon: <ScanLine className="w-6 h-6" />,
    to: "/scan-qr",
    ocid: "dashboard.scan_qr_button",
    color: "text-accent",
    bg: "bg-accent/10 hover:bg-accent/20 border-accent/20 hover:border-accent/50",
  },
  {
    label: "My QR",
    icon: <QrCode className="w-6 h-6" />,
    to: "/my-qr",
    ocid: "dashboard.my_qr_button",
    color: "text-primary",
    bg: "bg-primary/10 hover:bg-primary/20 border-primary/20 hover:border-primary/50",
  },
  {
    label: "History",
    icon: <History className="w-6 h-6" />,
    to: "/history",
    ocid: "dashboard.history_button",
    color: "text-accent",
    bg: "bg-accent/10 hover:bg-accent/20 border-accent/20 hover:border-accent/50",
  },
];

export default function DashboardPage() {
  const session = useAuthStore((s) => s.session);
  const logout = useAuthStore((s) => s.logout);
  const updateBalance = useAuthStore((s) => s.updateBalance);
  const navigate = useNavigate();
  const { getBalance, getTransactions, applyInterest } = useBackend();

  const [recentTxs, setRecentTxs] = useState<Transaction[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const userId = session?.userId ?? "";

  // Store callbacks in refs so useEffect can call them without being in deps
  const getBalanceRef = useRef(getBalance);
  const getTransactionsRef = useRef(getTransactions);
  const applyInterestRef = useRef(applyInterest);
  const updateBalanceRef = useRef(updateBalance);
  getBalanceRef.current = getBalance;
  getTransactionsRef.current = getTransactions;
  applyInterestRef.current = applyInterest;
  updateBalanceRef.current = updateBalance;

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    const fetchData = async () => {
      setLoadingData(true);
      try {
        // Apply daily interest silently — balance updates if interest was earned
        const [interestBal, txs] = await Promise.all([
          applyInterestRef.current(userId),
          getTransactionsRef.current(userId),
        ]);
        if (cancelled) return;
        if (interestBal !== null) {
          updateBalanceRef.current(interestBal);
        } else {
          // Fallback: fetch balance directly if applyInterest isn't available
          const bal = await getBalanceRef.current(userId);
          if (!cancelled && bal !== null) updateBalanceRef.current(bal);
        }
        setRecentTxs(txs.slice(0, 3));
      } catch {
        // silently fail — stale data stays visible
        try {
          const bal = await getBalanceRef.current(userId);
          if (!cancelled && bal !== null) updateBalanceRef.current(bal);
        } catch {
          // ignore
        }
      } finally {
        if (!cancelled) setLoadingData(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return (
    <ProtectedRoute>
      <div
        className="min-h-screen bg-background flex flex-col items-center pb-10 fade-in"
        data-ocid="dashboard.page"
      >
        <div className="w-full max-w-md px-4 space-y-5 pt-6">
          {/* Header */}
          <div
            className="flex items-center justify-between"
            data-ocid="dashboard.header"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-body tracking-wide">
                  Welcome back
                </p>
                <p className="text-base font-display font-semibold text-foreground leading-tight">
                  {session?.name}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout();
                navigate({ to: "/login" });
              }}
              icon={<LogOut className="w-4 h-4" />}
              className="text-muted-foreground hover:text-foreground"
              data-ocid="dashboard.logout_button"
            >
              Logout
            </Button>
          </div>

          {/* Balance Card */}
          <div className="slide-up" style={{ animationDelay: "0.05s" }}>
            <Card
              variant="elevated"
              padding="none"
              className="gradient-card glow-cyan overflow-hidden relative"
              data-ocid="dashboard.balance_card"
            >
              <div
                className="absolute -right-8 -top-8 w-48 h-48 rounded-full opacity-10"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.72 0.22 200) 0%, transparent 70%)",
                }}
              />
              <div
                className="absolute -right-4 bottom-4 w-32 h-32 rounded-full opacity-8"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.76 0.19 50) 0%, transparent 70%)",
                }}
              />
              <div className="relative z-10 p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm font-display font-bold text-foreground tracking-wide">
                      FPay
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-primary/60 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Virtual
                  </span>
                </div>
                <div className="mb-5">
                  <p className="text-xs text-primary/60 font-body mb-1 tracking-widest uppercase">
                    Balance
                  </p>
                  {loadingData ? (
                    <div className="h-10 w-40 rounded-lg bg-primary/10 animate-pulse" />
                  ) : (
                    <p
                      className="text-4xl font-display font-bold text-primary leading-none"
                      data-ocid="dashboard.balance_amount"
                    >
                      ₹{formatBalance(session?.balance ?? 0)}
                    </p>
                  )}
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm font-display font-semibold text-foreground/80 uppercase tracking-wider">
                      {session?.name?.toUpperCase().split(" ")[0] ?? ""}
                    </p>
                    <p
                      className="text-xs font-mono text-primary/50 mt-0.5"
                      data-ocid="dashboard.user_id"
                    >
                      {session?.userId}
                    </p>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground">
                    {session?.phone ? `••• ${session.phone.slice(-4)}` : ""}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Action Buttons Grid */}
          <div
            className="grid grid-cols-4 gap-3 slide-up"
            style={{ animationDelay: "0.12s" }}
            data-ocid="dashboard.actions_grid"
          >
            {ACTIONS.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => navigate({ to: action.to })}
                className={[
                  "flex flex-col items-center gap-2.5 p-3 rounded-xl border transition-smooth",
                  "active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  action.bg,
                ].join(" ")}
                data-ocid={action.ocid}
                aria-label={action.label}
              >
                <span className={action.color}>{action.icon}</span>
                <span className="text-[11px] font-display font-semibold text-foreground text-center leading-tight">
                  {action.label}
                </span>
              </button>
            ))}
          </div>

          {/* Recent Transactions */}
          <div
            className="slide-up"
            style={{ animationDelay: "0.2s" }}
            data-ocid="dashboard.recent_section"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-display font-semibold text-foreground">
                Recent Activity
              </h2>
              {recentTxs.length > 0 && (
                <button
                  type="button"
                  onClick={() => navigate({ to: "/history" })}
                  className="text-xs text-primary hover:text-primary/80 font-display font-medium transition-smooth"
                  data-ocid="dashboard.view_all_link"
                >
                  View all
                </button>
              )}
            </div>

            {loadingData ? (
              <div className="space-y-2" data-ocid="dashboard.loading_state">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-16 rounded-xl bg-card/50 border border-border animate-pulse"
                  />
                ))}
              </div>
            ) : recentTxs.length === 0 ? (
              <Card
                variant="default"
                padding="md"
                className="flex flex-col items-center py-8 gap-2"
                data-ocid="dashboard.empty_state"
              >
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-1">
                  <History className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-display font-medium text-foreground">
                  No transactions yet
                </p>
                <p className="text-xs text-muted-foreground font-body text-center">
                  Send money to get started
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => navigate({ to: "/send" })}
                  data-ocid="dashboard.empty_send_button"
                >
                  Send Money
                </Button>
              </Card>
            ) : (
              <div className="space-y-2" data-ocid="dashboard.recent_list">
                {recentTxs.map((tx, i) => {
                  const isSent = tx.senderId === userId;
                  const amountNum = Number(tx.amount);
                  return (
                    <Card
                      key={tx.txId}
                      variant="default"
                      padding="sm"
                      className="flex items-center gap-3 hover:border-border/80 transition-smooth"
                      data-ocid={`dashboard.tx_item.${i + 1}`}
                    >
                      <div
                        className={[
                          "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
                          isSent
                            ? "bg-destructive/15 border border-destructive/25"
                            : "bg-chart-2/15 border border-chart-2/25",
                        ].join(" ")}
                      >
                        {isSent ? (
                          <ArrowUpRight className="w-4 h-4 text-destructive" />
                        ) : (
                          <ArrowDownLeft className="w-4 h-4 text-chart-2" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-display font-semibold text-foreground truncate">
                          {isSent
                            ? `To: ${tx.receiverId}`
                            : `From: ${tx.senderId}`}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-body truncate">
                          {formatTxTime(tx.timestamp)}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p
                          className={[
                            "text-sm font-display font-bold",
                            isSent ? "text-destructive" : "text-chart-2",
                          ].join(" ")}
                        >
                          {isSent ? "−" : "+"}₹
                          {amountNum.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                        <p className="text-[10px] font-mono text-muted-foreground uppercase">
                          {isSent ? "Sent" : "Received"}
                        </p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          <p
            className="text-center text-[11px] text-muted-foreground font-body pt-1"
            data-ocid="dashboard.disclaimer"
          >
            This app is for simulation only. No real money is involved.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
