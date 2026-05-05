import { useActor } from "@caffeineai/core-infrastructure";
import { useCallback } from "react";
import { createActor } from "../backend";
import type {
  AuthError,
  Transaction,
  TxError,
  UserPublic,
} from "../backend.d.ts";
import { useAuthStore } from "../store/authStore";

// Friendly error messages for auth errors
function authErrorMessage(err: AuthError): string {
  switch (err) {
    case "userNotFound":
      return "Phone number not found. Check the number and try again.";
    case "phoneTaken":
      return "Phone number already registered. Try signing in instead.";
    case "invalidCredentials":
      return "Incorrect password. Please try again.";
    default:
      return "Authentication failed. Please try again.";
  }
}

// Friendly error messages for transaction errors
function txErrorMessage(err: TxError): string {
  switch (err) {
    case "insufficientBalance":
      return "Insufficient balance for this transfer.";
    case "selfTransfer":
      return "You cannot send money to yourself.";
    case "senderNotFound":
      return "Your account was not found. Please sign in again.";
    case "invalidAmount":
      return "Invalid amount. Please enter a valid amount greater than zero.";
    case "receiverNotFound":
      return "Receiver not found. Check the phone number or User ID.";
    case "invalidPin":
      return "Incorrect PIN. Please try again.";
    default:
      return "Transfer failed. Please try again.";
  }
}

export function useBackend() {
  // actor reference is stable — useActor returns the same instance
  const { actor } = useActor(createActor);
  const { setSession, updateBalance } = useAuthStore();

  const register = useCallback(
    async (
      name: string,
      phone: string,
      password: string,
      pin: string,
    ): Promise<
      { success: true; user: UserPublic } | { success: false; error: string }
    > => {
      if (!actor)
        return {
          success: false,
          error: "App is loading. Please try again shortly.",
        };
      try {
        const result = await actor.register({
          name: name.trim(),
          phone: phone.trim(),
          password,
          pin,
        });
        if (result.__kind__ === "ok") {
          const user = result.ok;
          setSession({
            userId: user.userId,
            name: user.name,
            phone: user.phone,
            balance: Number(user.balance),
            isLoggedIn: true,
          });
          return { success: true, user };
        }
        return { success: false, error: authErrorMessage(result.err) };
      } catch (e) {
        console.error("register error", e);
        return {
          success: false,
          error: "Registration failed. Please try again.",
        };
      }
    },
    // actor is a stable ref from useActor; setSession is stable from zustand
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [actor, setSession],
  );

  const login = useCallback(
    async (
      phone: string,
      password: string,
    ): Promise<
      { success: true; user: UserPublic } | { success: false; error: string }
    > => {
      if (!actor)
        return {
          success: false,
          error: "App is loading. Please try again shortly.",
        };
      try {
        const result = await actor.login({ phone: phone.trim(), password });
        if (result.__kind__ === "ok") {
          const user = result.ok;
          setSession({
            userId: user.userId,
            name: user.name,
            phone: user.phone,
            balance: Number(user.balance),
            isLoggedIn: true,
          });
          return { success: true, user };
        }
        return { success: false, error: authErrorMessage(result.err) };
      } catch (e) {
        console.error("login error", e);
        return { success: false, error: "Sign in failed. Please try again." };
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [actor, setSession],
  );

  const sendMoney = useCallback(
    async (
      senderId: string,
      receiverIdentifier: string,
      amount: number,
      pin: string,
      _note?: string,
    ): Promise<
      | { success: true; transaction: Transaction }
      | { success: false; error: string }
    > => {
      if (!actor)
        return {
          success: false,
          error: "App is loading. Please try again shortly.",
        };
      try {
        const result = await actor.sendMoney({
          senderId,
          receiverIdentifier: receiverIdentifier.trim(),
          amount: BigInt(Math.round(amount)),
          pin,
        });
        if (result.__kind__ === "ok") {
          // Refresh balance after successful transfer
          try {
            const newBalance = await actor.getBalance(senderId);
            if (newBalance !== null) updateBalance(Number(newBalance));
          } catch {
            // Non-critical — balance will refresh on next mount
          }
          return { success: true, transaction: result.ok };
        }
        return { success: false, error: txErrorMessage(result.err) };
      } catch (e) {
        console.error("sendMoney error", e);
        return { success: false, error: "Transfer failed. Please try again." };
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [actor, updateBalance],
  );

  const getBalance = useCallback(
    async (userId: string): Promise<number | null> => {
      if (!actor) return null;
      try {
        const bal = await actor.getBalance(userId);
        return bal !== null ? Number(bal) : null;
      } catch {
        return null;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [actor],
  );

  const getTransactions = useCallback(
    async (userId: string): Promise<Transaction[]> => {
      if (!actor) return [];
      try {
        return await actor.getTransactions(userId);
      } catch {
        return [];
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [actor],
  );

  const getUser = useCallback(
    async (identifier: string): Promise<UserPublic | null> => {
      if (!actor) return null;
      try {
        return await actor.getUser(identifier);
      } catch {
        return null;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [actor],
  );

  const applyInterest = useCallback(
    async (userId: string): Promise<number | null> => {
      if (!actor) return null;
      try {
        const result = await actor.applyInterest(userId);
        if (result.__kind__ === "ok") {
          return Number(result.ok);
        }
        return null;
      } catch {
        return null;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [actor],
  );

  return {
    register,
    login,
    sendMoney,
    getBalance,
    getTransactions,
    getUser,
    applyInterest,
  };
}
