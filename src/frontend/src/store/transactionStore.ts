import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Transaction } from "../types";

interface TransactionStore {
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  getTransactionsForUser: (userId: string) => Transaction[];
  clearAll: () => void;
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      transactions: [],
      addTransaction: (tx) =>
        set((state) => ({ transactions: [tx, ...state.transactions] })),
      getTransactionsForUser: (userId) =>
        get().transactions.filter(
          (tx) => tx.senderId === userId || tx.receiverId === userId,
        ),
      clearAll: () => set({ transactions: [] }),
    }),
    {
      name: "fpay-transactions",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
