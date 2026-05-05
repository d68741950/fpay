import { c as createLucideIcon, u as useNavigate, r as reactExports, j as jsxRuntimeExports, S as ShieldAlert } from "./index-Cw2-XxwA.js";
import { u as useAuthStore, C as Card } from "./authStore-BmLagjk9.js";
import { P as ProtectedRoute } from "./ProtectedRoute-BI5-MaxE.js";
import { u as useBackend } from "./useBackend-BPKkznfX.js";
import { A as ArrowLeft } from "./arrow-left-hNvK2GnG.js";
import { m as motion } from "./proxy-DTMhG-5M.js";
import { A as ArrowUpRight, a as ArrowDownLeft } from "./arrow-up-right-p_EkyF25.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }]
];
const Clock = createLucideIcon("clock", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["polyline", { points: "22 12 16 12 14 15 10 15 8 12 2 12", key: "o97t9d" }],
  [
    "path",
    {
      d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
      key: "oot6mr"
    }
  ]
];
const Inbox = createLucideIcon("inbox", __iconNode);
function formatDate(ts) {
  const ms = Number(ts / BigInt(1e6));
  const d = new Date(ms);
  return `${d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  })} · ${d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;
}
function formatAmount(amount, isSent) {
  const formatted = Number(amount).toLocaleString("en-IN", {
    minimumFractionDigits: 2
  });
  return `${isSent ? "-" : "+"}₹${formatted}`;
}
function TransactionCard({ tx, idx, isSent, onClick }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: idx * 0.06, duration: 0.3 },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick,
          className: "w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl",
          "data-ocid": `history.item.${idx + 1}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Card,
            {
              variant: "default",
              padding: "md",
              className: "flex items-center gap-3 hover:bg-card/80 hover:border-border/80 active:scale-[0.99] transition-smooth cursor-pointer",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${isSent ? "bg-destructive/10" : "bg-chart-2/10"}`,
                    children: isSent ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "w-5 h-5 text-destructive" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownLeft, { className: "w-5 h-5 text-chart-2" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-semibold text-foreground truncate", children: isSent ? `To: ${tx.receiverId}` : `From: ${tx.senderId}` }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 text-muted-foreground flex-shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: formatDate(tx.timestamp) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right flex-shrink-0 space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: `text-sm font-display font-bold ${isSent ? "text-destructive" : "text-chart-2"}`,
                      children: formatAmount(tx.amount, isSent)
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-chart-2/10 text-chart-2 text-xs font-semibold", children: [
                    "✓ ",
                    tx.status
                  ] })
                ] })
              ]
            }
          )
        }
      )
    }
  );
}
function HistoryPage() {
  const session = useAuthStore((s) => s.session);
  const { getTransactions } = useBackend();
  const navigate = useNavigate();
  const [transactions, setTransactions] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const getTransactionsRef = reactExports.useRef(getTransactions);
  getTransactionsRef.current = getTransactions;
  reactExports.useEffect(() => {
    if (!(session == null ? void 0 : session.userId)) return;
    let cancelled = false;
    const fetchTxs = async () => {
      setLoading(true);
      try {
        const txs = await getTransactionsRef.current(session.userId);
        if (!cancelled) setTransactions(txs);
      } catch {
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchTxs();
    return () => {
      cancelled = true;
    };
  }, [session == null ? void 0 : session.userId]);
  const handleTxClick = (tx) => {
    navigate({
      to: "/receipt",
      state: tx
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background flex flex-col items-center pb-10 px-4",
      "data-ocid": "history.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm pt-4 pb-2 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => navigate({ to: "/" }),
              className: "p-2 rounded-lg hover:bg-muted transition-smooth",
              "aria-label": "Back to Dashboard",
              "data-ocid": "history.back_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-5 h-5 text-foreground" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold text-foreground", children: "Transaction History" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: -8 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.1 },
            className: "w-full max-w-sm mb-4",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-accent/10 border border-accent/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "w-3.5 h-3.5 text-accent flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-accent font-display font-bold tracking-widest uppercase", children: "DEMO – No Real Transactions" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "w-3.5 h-3.5 text-accent flex-shrink-0" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-sm", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", "data-ocid": "history.loading_state", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-20 rounded-xl bg-card/50 border border-border animate-pulse"
          },
          i
        )) }) : transactions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            transition: { delay: 0.2 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Card,
              {
                variant: "elevated",
                padding: "lg",
                className: "flex flex-col items-center gap-4 py-14",
                "data-ocid": "history.empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Inbox, { className: "w-8 h-8 text-muted-foreground" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-display font-semibold", children: "No transactions yet" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Send money to someone to see your history here." })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => navigate({ to: "/send" }),
                      className: "text-sm text-primary font-display font-semibold hover:underline underline-offset-4 transition-smooth",
                      "data-ocid": "history.send_money_link",
                      children: "Send your first payment →"
                    }
                  )
                ]
              }
            )
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between mb-3",
              "data-ocid": "history.summary",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-body", children: [
                  transactions.length,
                  " transaction",
                  transactions.length !== 1 ? "s" : ""
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: "Tap to view receipt" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", "data-ocid": "history.list", children: transactions.map((tx, idx) => {
            const isSent = tx.senderId === (session == null ? void 0 : session.userId);
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              TransactionCard,
              {
                tx,
                idx,
                isSent,
                onClick: () => handleTxClick(tx)
              },
              tx.txId
            );
          }) })
        ] }) })
      ]
    }
  ) });
}
export {
  HistoryPage as default
};
