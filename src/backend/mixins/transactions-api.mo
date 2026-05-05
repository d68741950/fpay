import Map "mo:core/Map";
import List "mo:core/List";
import TxLib "../lib/transactions";
import Types "../types/transactions";
import AuthTypes "../types/auth";
import Common "../types/common";

mixin (
  users : Map.Map<Common.UserId, AuthTypes.User>,
  phoneIndex : Map.Map<Common.Phone, Common.UserId>,
  txsByUser : Map.Map<Common.UserId, List.List<Types.Transaction>>,
  txCounter : { var value : Nat },
) {

  /// Send money from sender to receiver (by userId or phone).
  public func sendMoney(req : Types.SendMoneyRequest) : async Common.Result<Types.Transaction, Types.TxError> {
    let result = TxLib.sendMoney(users, phoneIndex, txsByUser, req, txCounter.value);
    switch (result) {
      case (#ok(_)) { txCounter.value += 1 };
      case (#err(_)) {};
    };
    result
  };

  /// Return all transactions where the given userId is the sender.
  public query func getTransactions(userId : Common.UserId) : async [Types.Transaction] {
    TxLib.getTransactions(txsByUser, userId)
  };

  /// Return the current balance for a userId.
  public query func getBalance(userId : Common.UserId) : async ?Nat {
    TxLib.getBalance(users, userId)
  };

  /// Apply daily interest (₹100/day) for the given user.
  /// Returns the new balance in paise, or an error message.
  public func applyInterest(userId : Common.UserId) : async Common.Result<Nat, Text> {
    TxLib.applyInterest(users, userId)
  };
};
