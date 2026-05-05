import { j as jsxRuntimeExports, ae as Navigate } from "./index-Cw2-XxwA.js";
import { u as useAuthStore } from "./authStore-BmLagjk9.js";
function ProtectedRoute({ children }) {
  const session = useAuthStore((s) => s.session);
  if (!session || !session.isLoggedIn) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login", replace: true });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
}
export {
  ProtectedRoute as P
};
