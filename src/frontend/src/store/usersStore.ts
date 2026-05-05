import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { User } from "../types";

interface UsersStore {
  users: User[];
  addUser: (user: User) => void;
  getUserById: (userId: string) => User | undefined;
  getUserByPhone: (phone: string) => User | undefined;
  updateUserBalance: (userId: string, newBalance: number) => void;
}

export const useUsersStore = create<UsersStore>()(
  persist(
    (set, get) => ({
      users: [],
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      getUserById: (userId) => get().users.find((u) => u.userId === userId),
      getUserByPhone: (phone) => get().users.find((u) => u.phone === phone),
      updateUserBalance: (userId, newBalance) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.userId === userId ? { ...u, balance: newBalance } : u,
          ),
        })),
    }),
    {
      name: "fpay-users",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
