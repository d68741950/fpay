import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Types "../types/transactions";
import AuthTypes "../types/auth";
import Common "../types/common";

module {
  // Generate a transaction ID from a counter
  func generateTxId(counter : Nat) : Text {
    "TX" # counter.toText()
  };

  // Resolve identifier (userId or phone) to a User record
  func resolveUser(
    users : Map.Map<Common.UserId, AuthTypes.User>,
    phoneIndex : Map.Map<Common.Phone, Common.UserId>,
    identifier : Text,
  ) : ?AuthTypes.User {
    switch (users.get(identifier)) {
      case (?u) { return ?u };
      case null {};
    };
    switch (phoneIndex.get(identifier)) {
      case null { null };
      case (?uid) { users.get(uid) };
    }
  };

  // Append a transaction to a user's list in the map
  func appendTx(
    txsByUser : Map.Map<Common.UserId, List.List<Types.Transaction>>,
    userId : Common.UserId,
    tx : Types.Transaction,
  ) {
    switch (txsByUser.get(userId)) {
      case (?list) { list.add(tx) };
      case null {
        let newList = List.empty<Types.Transaction>();
        newList.add(tx);
        txsByUser.add(userId, newList);
      };
    };
  };

  public func sendMoney(
    users : Map.Map<Common.UserId, AuthTypes.User>,
    phoneIndex : Map.Map<Common.Phone, Common.UserId>,
    txsByUser : Map.Map<Common.UserId, List.List<Types.Transaction>>,
    req : Types.SendMoneyRequest,
    txCounter : Nat,
  ) : Common.Result<Types.Transaction, Types.TxError> {
    if (req.amount == 0) { return #err(#invalidAmount) };

    // Resolve sender
    let sender = switch (users.get(req.senderId)) {
      case null { return #err(#senderNotFound) };
      case (?u) { u };
    };

    // Verify PIN before any other checks
    if (sender.pin != req.pin) { return #err(#invalidPin) };

    // Resolve receiver
    let receiver = switch (resolveUser(users, phoneIndex, req.receiverIdentifier)) {
      case null { return #err(#receiverNotFound) };
      case (?u) { u };
    };

    // Prevent self-transfer
    if (sender.userId == receiver.userId) { return #err(#selfTransfer) };

    // Check balance
    if (sender.balance < req.amount) { return #err(#insufficientBalance) };

    // Perform transfer (mutate var fields directly)
    sender.balance -= req.amount;
    receiver.balance += req.amount;

    let tx : Types.Transaction = {
      txId = generateTxId(txCounter);
      senderId = sender.userId;
      receiverId = receiver.userId;
      amount = req.amount;
      timestamp = Time.now();
      status = "Success";
    };

    // Append transaction to BOTH sender's and receiver's lists
    appendTx(txsByUser, sender.userId, tx);
    appendTx(txsByUser, receiver.userId, tx);

    #ok(tx)
  };

  public func getTransactions(
    txsByUser : Map.Map<Common.UserId, List.List<Types.Transaction>>,
    userId : Common.UserId,
  ) : [Types.Transaction] {
    switch (txsByUser.get(userId)) {
      case null { [] };
      case (?list) { list.toArray() };
    }
  };

  public func getBalance(
    users : Map.Map<Common.UserId, AuthTypes.User>,
    userId : Common.UserId,
  ) : ?Nat {
    switch (users.get(userId)) {
      case null { null };
      case (?user) { ?user.balance };
    }
  };

  // Apply daily interest: ₹100 (10_000 paise) per elapsed day since lastInterestTimestamp.
  // Returns the new balance (or current balance if < 1 day elapsed).
  public func applyInterest(
    users : Map.Map<Common.UserId, AuthTypes.User>,
    userId : Common.UserId,
  ) : Common.Result<Nat, Text> {
    let user = switch (users.get(userId)) {
      case null { return #err("User not found") };
      case (?u) { u };
    };

    let now = Time.now();
    let elapsed = now - user.lastInterestTimestamp;
    let nanosPerDay : Int = 86_400_000_000_000; // 24 * 60 * 60 * 1_000_000_000
    let days = elapsed / nanosPerDay;

    if (days >= 1) {
      let interest = days.toNat() * 10_000; // ₹100 per day in paise
      user.balance += interest;
      user.lastInterestTimestamp := user.lastInterestTimestamp + (days * nanosPerDay);
    };

    #ok(user.balance)
  };
};
