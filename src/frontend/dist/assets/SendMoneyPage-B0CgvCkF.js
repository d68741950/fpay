import { c as createLucideIcon, u as useNavigate, a as useSearch, r as reactExports, j as jsxRuntimeExports } from "./index-Cw2-XxwA.js";
import { B as Button } from "./Button-B7lkZ5NA.js";
import { u as useAuthStore, C as Card } from "./authStore-BmLagjk9.js";
import { I as Input } from "./Input-DiH7GCvm.js";
import { P as ProtectedRoute } from "./ProtectedRoute-BI5-MaxE.js";
import { u as useBackend } from "./useBackend-BPKkznfX.js";
import { m as motion } from "./proxy-DTMhG-5M.js";
import { A as ArrowLeft } from "./arrow-left-hNvK2GnG.js";
import { A as AnimatePresence, C as CircleCheck } from "./index-DnWCc8K3.js";
import { U as User } from "./user-DfRmn4aJ.js";
import { C as CircleAlert } from "./circle-alert-CcT5Q24P.js";
import { S as SendHorizontal } from "./send-horizontal-BvrF3U-b.js";
import { S as Shield } from "./shield-FLL3bOfX.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M6 3h12", key: "ggurg9" }],
  ["path", { d: "M6 8h12", key: "6g4wlu" }],
  ["path", { d: "m6 13 8.5 8", key: "u1kupk" }],
  ["path", { d: "M6 13h3", key: "wdp6ag" }],
  ["path", { d: "M9 13c6.667 0 6.667-10 0-10", key: "1nkvk2" }]
];
const IndianRupee = createLucideIcon("indian-rupee", __iconNode);
function SendMoneyPage() {
  const session = useAuthStore((s) => s.session);
  const { sendMoney, getUser } = useBackend();
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const [step, setStep] = reactExports.useState("form");
  const [receiver, setReceiver] = reactExports.useState((search == null ? void 0 : search.receiver) ?? "");
  const [receiverName, setReceiverName] = reactExports.useState(null);
  const [resolving, setResolving] = reactExports.useState(false);
  const [amount, setAmount] = reactExports.useState("");
  const [note, setNote] = reactExports.useState("");
  const [pin, setPin] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [processing, setProcessing] = reactExports.useState(false);
  const [processingStep, setProcessingStep] = reactExports.useState(0);
  const pinInputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (search == null ? void 0 : search.receiver) {
      setReceiver(search.receiver);
      resolveReceiver(search.receiver);
    }
  }, [search == null ? void 0 : search.receiver]);
  reactExports.useEffect(() => {
    if (step === "pin") {
      setTimeout(() => {
        var _a;
        return (_a = pinInputRef.current) == null ? void 0 : _a.focus();
      }, 100);
    }
  }, [step]);
  const resolveReceiver = async (id) => {
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
  const handleFormSubmit = (e) => {
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
        `Insufficient balance. Available: ₹${session.balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}.`
      );
      return;
    }
    setError("");
    setPin("");
    setStep("pin");
  };
  const handlePinSubmit = async (e) => {
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
    await new Promise((r) => setTimeout(r, 1e3));
    setProcessingStep(2);
    await new Promise((r) => setTimeout(r, 400));
    const amountNum = Number.parseFloat(amount);
    const result = await sendMoney(
      session.userId,
      receiver.trim(),
      amountNum,
      pin,
      note || void 0
    );
    setProcessing(false);
    if (result.success) {
      navigate({
        to: "/receipt",
        state: result.transaction
      });
    } else {
      if (result.error.includes("Incorrect PIN")) {
        setPin("");
        setError(result.error);
        setTimeout(() => {
          var _a;
          return (_a = pinInputRef.current) == null ? void 0 : _a.focus();
        }, 50);
      } else {
        setStep("form");
        setError(result.error);
      }
    }
  };
  const processingLabels = [
    "Authenticating…",
    "Transferring funds…",
    "Confirming transaction…"
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ProtectedRoute, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "min-h-screen bg-background flex flex-col items-center py-8 px-4",
      "data-ocid": "send.page",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          className: "w-full max-w-sm space-y-6",
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4, ease: [0.34, 1.2, 0.64, 1] },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    if (step === "pin" && !processing) {
                      setStep("form");
                      setError("");
                    } else {
                      navigate({ to: "/" });
                    }
                  },
                  className: "p-2 rounded-lg hover:bg-muted transition-smooth",
                  "data-ocid": "send.back_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-5 h-5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold text-foreground", children: step === "pin" ? "Confirm with PIN" : "Send Money" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "DEMO — no real money moves" })
              ] })
            ] }),
            session && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                className: "flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/25 w-fit",
                initial: { opacity: 0, scale: 0.9 },
                animate: { opacity: 1, scale: 1 },
                transition: { delay: 0.1 },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "w-3.5 h-3.5 text-primary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-display font-semibold text-primary", children: [
                    session.balance.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }),
                    " ",
                    "available"
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: step === "form" ? (
              /* ── FORM STEP ── */
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0, x: -20 },
                  animate: { opacity: 1, x: 0 },
                  exit: { opacity: 0, x: -20 },
                  transition: { duration: 0.25 },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { variant: "elevated", padding: "lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleFormSubmit, className: "space-y-5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          label: "Receiver (Phone or User ID)",
                          placeholder: "Phone number or FPXXXXXXXX",
                          value: receiver,
                          onChange: (e) => {
                            setReceiver(e.target.value);
                            setReceiverName(null);
                            setError("");
                          },
                          onBlur: () => resolveReceiver(receiver),
                          leftIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4" }),
                          "data-ocid": "send.receiver_input"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(AnimatePresence, { children: [
                        resolving && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          motion.p,
                          {
                            initial: { opacity: 0 },
                            animate: { opacity: 1 },
                            exit: { opacity: 0 },
                            className: "text-xs text-muted-foreground pl-1",
                            "data-ocid": "send.receiver_loading",
                            children: "Looking up receiver…"
                          }
                        ),
                        receiverName && !resolving && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          motion.div,
                          {
                            initial: { opacity: 0, y: -4 },
                            animate: { opacity: 1, y: 0 },
                            exit: { opacity: 0 },
                            className: "flex items-center gap-2 pl-1",
                            "data-ocid": "send.receiver_resolved",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5 text-chart-2 flex-shrink-0" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-chart-2 font-display font-semibold", children: receiverName })
                            ]
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        label: "Amount (₹)",
                        type: "number",
                        placeholder: "0.00",
                        min: "1",
                        step: "0.01",
                        value: amount,
                        onChange: (e) => {
                          setAmount(e.target.value);
                          setError("");
                        },
                        leftIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "w-4 h-4" }),
                        "data-ocid": "send.amount_input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        label: "Note (optional)",
                        placeholder: "What's this for?",
                        value: note,
                        onChange: (e) => setNote(e.target.value),
                        "data-ocid": "send.note_input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      motion.div,
                      {
                        className: "flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30",
                        initial: { opacity: 0, y: -6 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: -6 },
                        "data-ocid": "send.error_state",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 text-destructive flex-shrink-0 mt-0.5" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: error })
                        ]
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "submit",
                        fullWidth: true,
                        size: "lg",
                        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(SendHorizontal, { className: "w-5 h-5" }),
                        "data-ocid": "send.submit_button",
                        children: "Continue to PIN"
                      }
                    )
                  ] }) })
                },
                "form"
              )
            ) : (
              /* ── PIN STEP ── */
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0, x: 20 },
                  animate: { opacity: 1, x: 0 },
                  exit: { opacity: 0, x: 20 },
                  transition: { duration: 0.25 },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { variant: "elevated", padding: "lg", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5 p-3 rounded-xl bg-primary/8 border border-primary/20", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: "Sending to" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-semibold text-foreground truncate max-w-[140px]", children: receiverName ?? receiver })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: "Amount" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg font-display font-bold text-primary", children: [
                          "₹",
                          Number(amount).toLocaleString("en-IN", {
                            minimumFractionDigits: 2
                          })
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handlePinSubmit, className: "space-y-5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Input,
                          {
                            ref: pinInputRef,
                            label: "Enter Transaction PIN to confirm",
                            type: "password",
                            inputMode: "numeric",
                            placeholder: "••••",
                            maxLength: 4,
                            value: pin,
                            onChange: (e) => {
                              const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                              setPin(val);
                              setError("");
                            },
                            leftIcon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4" }),
                            "data-ocid": "send.pin_input"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-3 py-1", children: [0, 1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          motion.div,
                          {
                            className: "w-3 h-3 rounded-full border-2",
                            animate: {
                              backgroundColor: i < pin.length ? "oklch(0.72 0.22 200)" : "transparent",
                              borderColor: i < pin.length ? "oklch(0.72 0.22 200)" : "oklch(0.4 0.025 265)",
                              scale: i < pin.length ? 1.15 : 1
                            },
                            transition: { duration: 0.15 }
                          },
                          i
                        )) })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        motion.div,
                        {
                          className: "flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30",
                          initial: { opacity: 0, x: -6 },
                          animate: { opacity: 1, x: 0 },
                          exit: { opacity: 0 },
                          "data-ocid": "send.pin_error_state",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 text-destructive flex-shrink-0 mt-0.5" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: error })
                          ]
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: processing && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        motion.div,
                        {
                          className: "flex flex-col items-center gap-4 py-4",
                          initial: { opacity: 0, scale: 0.9 },
                          animate: { opacity: 1, scale: 1 },
                          exit: { opacity: 0, scale: 0.9 },
                          "data-ocid": "send.loading_state",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-center justify-center", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                motion.div,
                                {
                                  className: "absolute w-20 h-20 rounded-full border-2 border-primary/30",
                                  animate: { scale: [1, 1.5], opacity: [0.6, 0] },
                                  transition: {
                                    duration: 1.2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "easeOut"
                                  }
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                motion.div,
                                {
                                  className: "absolute w-14 h-14 rounded-full border-2 border-primary/50",
                                  animate: { scale: [1, 1.4], opacity: [0.8, 0] },
                                  transition: {
                                    duration: 1.2,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "easeOut",
                                    delay: 0.3
                                  }
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                motion.div,
                                {
                                  className: "w-5 h-5 rounded-full border-2 border-primary/30 border-t-primary",
                                  animate: { rotate: 360 },
                                  transition: {
                                    duration: 0.8,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: "linear"
                                  }
                                }
                              ) })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-1", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                motion.p,
                                {
                                  className: "text-sm font-display font-semibold text-primary",
                                  initial: { opacity: 0, y: 6 },
                                  animate: { opacity: 1, y: 0 },
                                  transition: { duration: 0.3 },
                                  children: processingLabels[processingStep]
                                },
                                processingStep
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Please wait…" })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: processingLabels.map((label, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                              motion.div,
                              {
                                className: "w-2 h-2 rounded-full",
                                animate: {
                                  backgroundColor: i <= processingStep ? "oklch(0.72 0.22 200)" : "oklch(0.28 0.025 265)",
                                  scale: i === processingStep ? 1.3 : 1
                                },
                                transition: { duration: 0.3 }
                              },
                              label
                            )) })
                          ]
                        }
                      ) }),
                      !processing && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          type: "submit",
                          fullWidth: true,
                          size: "lg",
                          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5" }),
                          "data-ocid": "send.confirm_button",
                          disabled: pin.length !== 4,
                          children: "Confirm & Send"
                        }
                      )
                    ] })
                  ] })
                },
                "pin"
              )
            ) }),
            step === "form" && !processing && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { delay: 0.25 },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-2 font-display font-medium", children: "Quick amounts" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: [100, 250, 500, 1e3, 2e3].map((val) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setAmount(String(val)),
                      className: "px-3 py-1.5 text-xs font-display font-semibold rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-smooth",
                      "data-ocid": `send.quick_amount.${val}`,
                      children: [
                        "₹",
                        val.toLocaleString("en-IN")
                      ]
                    },
                    val
                  )) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-3 rounded-lg bg-muted/40 border border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-muted-foreground flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "This is a simulation. No real currency is transferred." })
            ] })
          ]
        }
      )
    }
  ) });
}
export {
  SendMoneyPage as default
};
