import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthSession {
  userId: string;
  name: string;
  phone: string;
  balance: number;
  isLoggedIn: boolean;
}

interface AuthStore {
  session: AuthSession | null;
  setSession: (session: AuthSession) => void;
  updateBalance: (balance: number) => void;
  logout: () => void;
}

export type { AuthSession };

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      updateBalance: (balance) =>
        set((state) =>
          state.session ? { session: { ...state.session, balance } } : state,
        ),
      logout: () => set({ session: null }),
    }),
    {
      name: "fpay-auth-session",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
