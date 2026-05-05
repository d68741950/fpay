import { c as createLucideIcon, u as useNavigate, r as reactExports, j as jsxRuntimeExports } from "./index-Cw2-XxwA.js";
import { B as Button } from "./Button-B7lkZ5NA.js";
import { u as useAuthStore, C as Card } from "./authStore-BmLagjk9.js";
import { P as ProtectedRoute } from "./ProtectedRoute-BI5-MaxE.js";
import { u as useBackend } from "./useBackend-BPKkznfX.js";
import { U as User } from "./user-DfRmn4aJ.js";
import { Z as Zap } from "./zap-D4UHrrNd.js";
import { H as History } from "./history-C_ydJ7I9.js";
import { A as ArrowUpRight, a as ArrowDownLeft } from "./arrow-up-right-p_EkyF25.js";
import { S as SendHorizontal } from "./send-horizontal-BvrF3U-b.js";
import { S as ScanLine } from "./scan-line-DaoeLoje.js";
import { Q as QrCode } from "./qr-code-hgYSlrWs.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode);
function formatBalance(amount) {
  return amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
function formatTxTime(ts) {
  const ms = Number(ts / BigInt(1e6));
  const d = new Date(ms);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
}
const ACTIONS = [
  {
    label: "Send Money",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(SendHorizontal, { className: "w-6 h-6" }),
    to: "/send",
    ocid: "dashboard.send_button",
    color: "text-primary",
    bg: "bg-primary/10 hover:bg-primary/20 border-primary/20 hover:border-primary/50"
  },
  {
    label: "Scan QR",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "w-6 h-6" }),
    to: "/scan-qr",
    ocid: "dashboard.scan_qr_button",
    color: "text-accent",
    bg: "bg-accent/10 hover:bg-accent/20 border-accent/20 hover:border-accent/50"
  },
  {
    label: "My QR",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "w-6 h-6" }),
    to: "/my-qr",
    ocid: "dashboard.my_qr_button",
    color: "text-primary",
    bg: "bg-primary/10 hover:bg-primary/20 border-primary/20 hover:border-primary/50"
  },
  {
    label: "History",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "w-6 h-6" }),
    to: "/history",
    ocid: "dashboard.history_button",
    color: "text-accent",
    bg: "bg-accent/10 hover:bg-accent/20 border-accent/20 hover:border-accent/50"
  }
];
function DashboardPage() {
  var _a;
  const session = useAuthStore((s) => s.session);
  const logout = useAuthStore((s) => s.logout);
  const updateBalance = useAuthStore((s) => s.updateBalance);
  const navigate = useNavigate();
  const { getBalance, getTransactions, applyInterest } = useBackend();
  const [recentTxs, setRecentTxs] = reactExports.useState([]);
  const [loadingData, setLoadingData] = reactExports.useState(true);
  const userId = (session == null ? void 0 : session.userId) ?? "";
  const getBalanceRef = reactExports.useRef(getBalance);
  const getTransactionsRef = reactExports.useRef(getTransactions);
  const applyInterestRef = reactExports.useRef(applyInterest);
  const updateBalanceRef = reactExports.useRef(updateBalance);
  getBalanceRef.current = getBalance;
  getTransactionsRef.current = getTransactions;
  applyInterestRef.current = applyInterest;
  updateBalanceRef.current = updateBalance;
  reactExports.useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [interestBal, txs] = await Promise.all([
          applyInterestRef.current(userId),
          getTransactionsRef.current(userId)
        ]);
        if (cancelled) return;
        if (interestBal !== null) {
          updateBalanceRef.current(interestBal);
        } else {
          const bal = await getBalanceRef.current(userId);
          if (!cancelled && bal !== null) updateBalanceRef.current(bal);
        }
        setRecentTxs(txs.slice(0, 3));
      } catch {
        try {
          const bal = await getBalanceRef.current(userId);
          if (!cancelled && bal !== null) updateBalanceRef.current(bal);
        } catch {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "min-h-screen bg-background flex flex-col items-center pb-10 fade-in",
      "data-ocid": "dashboard.page",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md px-4 space-y-5 pt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between",
            "data-ocid": "dashboard.header",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-5 h-5 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body tracking-wide", children: "Welcome back" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-display font-semibold text-foreground leading-tight", children: session == null ? void 0 : session.name })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => {
                    logout();
                    navigate({ to: "/login" });
                  },
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-4 h-4" }),
                  className: "text-muted-foreground hover:text-foreground",
                  "data-ocid": "dashboard.logout_button",
                  children: "Logout"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "slide-up", style: { animationDelay: "0.05s" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            variant: "elevated",
            padding: "none",
            className: "gradient-card glow-cyan overflow-hidden relative",
            "data-ocid": "dashboard.balance_card",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute -right-8 -top-8 w-48 h-48 rounded-full opacity-10",
                  style: {
                    background: "radial-gradient(circle, oklch(0.72 0.22 200) 0%, transparent 70%)"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute -right-4 bottom-4 w-32 h-32 rounded-full opacity-8",
                  style: {
                    background: "radial-gradient(circle, oklch(0.76 0.19 50) 0%, transparent 70%)"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 p-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-primary" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-display font-bold text-foreground tracking-wide", children: "FPay" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-primary/60 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-wider", children: "Virtual" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-primary/60 font-body mb-1 tracking-widest uppercase", children: "Balance" }),
                  loadingData ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-40 rounded-lg bg-primary/10 animate-pulse" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      className: "text-4xl font-display font-bold text-primary leading-none",
                      "data-ocid": "dashboard.balance_amount",
                      children: [
                        "₹",
                        formatBalance((session == null ? void 0 : session.balance) ?? 0)
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-semibold text-foreground/80 uppercase tracking-wider", children: ((_a = session == null ? void 0 : session.name) == null ? void 0 : _a.toUpperCase().split(" ")[0]) ?? "" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-xs font-mono text-primary/50 mt-0.5",
                        "data-ocid": "dashboard.user_id",
                        children: session == null ? void 0 : session.userId
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono text-muted-foreground", children: (session == null ? void 0 : session.phone) ? `••• ${session.phone.slice(-4)}` : "" })
                ] })
              ] })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid grid-cols-4 gap-3 slide-up",
            style: { animationDelay: "0.12s" },
            "data-ocid": "dashboard.actions_grid",
            children: ACTIONS.map((action) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => navigate({ to: action.to }),
                className: [
                  "flex flex-col items-center gap-2.5 p-3 rounded-xl border transition-smooth",
                  "active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  action.bg
                ].join(" "),
                "data-ocid": action.ocid,
                "aria-label": action.label,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: action.color, children: action.icon }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-display font-semibold text-foreground text-center leading-tight", children: action.label })
                ]
              },
              action.label
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "slide-up",
            style: { animationDelay: "0.2s" },
            "data-ocid": "dashboard.recent_section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-display font-semibold text-foreground", children: "Recent Activity" }),
                recentTxs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => navigate({ to: "/history" }),
                    className: "text-xs text-primary hover:text-primary/80 font-display font-medium transition-smooth",
                    "data-ocid": "dashboard.view_all_link",
                    children: "View all"
                  }
                )
              ] }),
              loadingData ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "dashboard.loading_state", children: [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "h-16 rounded-xl bg-card/50 border border-border animate-pulse"
                },
                i
              )) }) : recentTxs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Card,
                {
                  variant: "default",
                  padding: "md",
                  className: "flex flex-col items-center py-8 gap-2",
                  "data-ocid": "dashboard.empty_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "w-6 h-6 text-muted-foreground" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-medium text-foreground", children: "No transactions yet" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body text-center", children: "Send money to get started" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "outline",
                        size: "sm",
                        className: "mt-2",
                        onClick: () => navigate({ to: "/send" }),
                        "data-ocid": "dashboard.empty_send_button",
                        children: "Send Money"
                      }
                    )
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "dashboard.recent_list", children: recentTxs.map((tx, i) => {
                const isSent = tx.senderId === userId;
                const amountNum = Number(tx.amount);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Card,
                  {
                    variant: "default",
                    padding: "sm",
                    className: "flex items-center gap-3 hover:border-border/80 transition-smooth",
                    "data-ocid": `dashboard.tx_item.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: [
                            "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0",
                            isSent ? "bg-destructive/15 border border-destructive/25" : "bg-chart-2/15 border border-chart-2/25"
                          ].join(" "),
                          children: isSent ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "w-4 h-4 text-destructive" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownLeft, { className: "w-4 h-4 text-chart-2" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-semibold text-foreground truncate", children: isSent ? `To: ${tx.receiverId}` : `From: ${tx.senderId}` }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground font-body truncate", children: formatTxTime(tx.timestamp) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right flex-shrink-0", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "p",
                          {
                            className: [
                              "text-sm font-display font-bold",
                              isSent ? "text-destructive" : "text-chart-2"
                            ].join(" "),
                            children: [
                              isSent ? "−" : "+",
                              "₹",
                              amountNum.toLocaleString("en-IN", {
                                minimumFractionDigits: 2
                              })
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-mono text-muted-foreground uppercase", children: isSent ? "Sent" : "Received" })
                      ] })
                    ]
                  },
                  tx.txId
                );
              }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-center text-[11px] text-muted-foreground font-body pt-1",
            "data-ocid": "dashboard.disclaimer",
            children: "This app is for simulation only. No real money is involved."
          }
        )
      ] })
    }
  ) });
}
export {
  DashboardPage as default
};
