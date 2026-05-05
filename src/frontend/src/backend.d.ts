import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type UserId = string;
export type Timestamp = bigint;
export interface SendMoneyRequest {
    pin: string;
    receiverIdentifier: string;
    amount: bigint;
    senderId: UserId;
}
export interface UserPublic {
    balance: bigint;
    userId: UserId;
    name: string;
    phone: Phone;
}
export type Result_2 = {
    __kind__: "ok";
    ok: bigint;
} | {
    __kind__: "err";
    err: string;
};
export type Result = {
    __kind__: "ok";
    ok: Transaction;
} | {
    __kind__: "err";
    err: TxError;
};
export interface RegisterRequest {
    pin: string;
    password: string;
    name: string;
    phone: Phone;
}
export type Phone = string;
export interface LoginRequest {
    password: string;
    phone: Phone;
}
export type Result_1 = {
    __kind__: "ok";
    ok: UserPublic;
} | {
    __kind__: "err";
    err: AuthError;
};
export interface Transaction {
    status: string;
    txId: string;
    receiverId: UserId;
    timestamp: Timestamp;
    amount: bigint;
    senderId: UserId;
}
export enum AuthError {
    userNotFound = "userNotFound",
    phoneTaken = "phoneTaken",
    invalidCredentials = "invalidCredentials"
}
export enum TxError {
    insufficientBalance = "insufficientBalance",
    selfTransfer = "selfTransfer",
    invalidPin = "invalidPin",
    senderNotFound = "senderNotFound",
    invalidAmount = "invalidAmount",
    receiverNotFound = "receiverNotFound"
}
export interface backendInterface {
    applyInterest(userId: UserId): Promise<Result_2>;
    getBalance(userId: UserId): Promise<bigint | null>;
    getTransactions(userId: UserId): Promise<Array<Transaction>>;
    getUser(identifier: string): Promise<UserPublic | null>;
    login(req: LoginRequest): Promise<Result_1>;
    register(req: RegisterRequest): Promise<Result_1>;
    sendMoney(req: SendMoneyRequest): Promise<Result>;
}
