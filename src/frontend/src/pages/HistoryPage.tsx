import { useNavigate } from "@tanstack/react-router";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  Clock,
  Inbox,
  ShieldAlert,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Transaction } from "../backend.d.ts";
import { Card } from "../components/Card";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { useBackend } from "../hooks/useBackend";
import { useAuthStore } from "../store/authStore";

function formatDate(ts: bigint): string {
  const ms = Number(ts / BigInt(1_000_000));
  const d = new Date(ms);
  return `${d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })} · ${d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;
}

function formatAmount(amount: bigint, isSent: boolean): string {
  const formatted = Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
  });
  return `${isSent ? "-" : "+"}₹${formatted}`;
}

interface TxCardProps {
  tx: Transaction;
  idx: number;
  isSent: boolean;
  onClick: () => void;
}

function TransactionCard({ tx, idx, isSent, onClick }: TxCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.06, duration: 0.3 }}
    >
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
        data-ocid={`history.item.${idx + 1}`}
      >
        <Card
          variant="default"
          padding="md"
          className="flex items-center gap-3 hover:bg-card/80 hover:border-border/80 active:scale-[0.99] transition-smooth cursor-pointer"
        >
          {/* Icon */}
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
              isSent ? "bg-destructive/10" : "bg-chart-2/10"
            }`}
          >
            {isSent ? (
              <ArrowUpRight className="w-5 h-5 text-destructive" />
            ) : (
              <ArrowDownLeft className="w-5 h-5 text-chart-2" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-display font-semibold text-foreground truncate">
              {isSent ? `To: ${tx.receiverId}` : `From: ${tx.senderId}`}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <p className="text-xs text-muted-foreground truncate">
                {formatDate(tx.timestamp)}
              </p>
            </div>
          </div>

          {/* Amount + status */}
          <div className="text-right flex-shrink-0 space-y-1">
            <p
              className={`text-sm font-display font-bold ${
                isSent ? "text-destructive" : "text-chart-2"
              }`}
            >
              {formatAmount(tx.amount, isSent)}
            </p>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-chart-2/10 text-chart-2 text-xs font-semibold">
              ✓ {tx.status}
            </span>
          </div>
        </Card>
      </button>
    </motion.div>
  );
}

export default function HistoryPage() {
  const session = useAuthStore((s) => s.session);
  const { getTransactions } = useBackend();
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Use a ref so useEffect doesn't re-run when getTransactions identity changes
  const getTransactionsRef = useRef(getTransactions);
  getTransactionsRef.current = getTransactions;

  useEffect(() => {
    if (!session?.userId) return;
    let cancelled = false;
    const fetchTxs = async () => {
      setLoading(true);
      try {
        const txs = await getTransactionsRef.current(session.userId);
        if (!cancelled) setTransactions(txs);
      } catch {
        // show empty state
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchTxs();
    return () => {
      cancelled = true;
    };
  }, [session?.userId]);

  const handleTxClick = (tx: Transaction) => {
    navigate({
      to: "/receipt",
      state: tx as unknown as true,
    });
  };

  return (
    <ProtectedRoute>
      <div
        className="min-h-screen bg-background flex flex-col items-center pb-10 px-4"
        data-ocid="history.page"
      >
        {/* Top nav */}
        <div className="w-full max-w-sm pt-4 pb-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="p-2 rounded-lg hover:bg-muted transition-smooth"
            aria-label="Back to Dashboard"
            data-ocid="history.back_button"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl font-display font-bold text-foreground">
            Transaction History
          </h1>
        </div>

        {/* DEMO notice */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-sm mb-4"
        >
          <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-accent/10 border border-accent/30">
            <ShieldAlert className="w-3.5 h-3.5 text-accent flex-shrink-0" />
            <span className="text-xs text-accent font-display font-bold tracking-widest uppercase">
              DEMO – No Real Transactions
            </span>
            <ShieldAlert className="w-3.5 h-3.5 text-accent flex-shrink-0" />
          </div>
        </motion.div>

        <div className="w-full max-w-sm">
          {loading ? (
            <div className="space-y-2.5" data-ocid="history.loading_state">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 rounded-xl bg-card/50 border border-border animate-pulse"
                />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card
                variant="elevated"
                padding="lg"
                className="flex flex-col items-center gap-4 py-14"
                data-ocid="history.empty_state"
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Inbox className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-foreground font-display font-semibold">
                    No transactions yet
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Send money to someone to see your history here.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/send" })}
                  className="text-sm text-primary font-display font-semibold hover:underline underline-offset-4 transition-smooth"
                  data-ocid="history.send_money_link"
                >
                  Send your first payment →
                </button>
              </Card>
            </motion.div>
          ) : (
            <>
              <div
                className="flex items-center justify-between mb-3"
                data-ocid="history.summary"
              >
                <p className="text-xs text-muted-foreground font-body">
                  {transactions.length} transaction
                  {transactions.length !== 1 ? "s" : ""}
                </p>
                <p className="text-xs text-muted-foreground font-body">
                  Tap to view receipt
                </p>
              </div>

              <div className="space-y-2.5" data-ocid="history.list">
                {transactions.map((tx, idx) => {
                  const isSent = tx.senderId === session?.userId;
                  return (
                    <TransactionCard
                      key={tx.txId}
                      tx={tx}
                      idx={idx}
                      isSent={isSent}
                      onClick={() => handleTxClick(tx)}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
