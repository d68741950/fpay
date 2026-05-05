export interface User {
  userId: string;
  name: string;
  phone: string;
  password: string;
  pin: string;
  balance: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  receiverName: string;
  amount: number;
  timestamp: string;
  status: "success" | "failed";
  note?: string;
}

export interface AuthSession {
  userId: string;
  name: string;
  phone: string;
  balance: number;
  isLoggedIn: boolean;
}

export type SendMoneyResult =
  | { success: true; transaction: Transaction }
  | { success: false; error: string };

export interface RegisterRequest {
  name: string;
  phone: string;
  password: string;
  pin: string;
}
