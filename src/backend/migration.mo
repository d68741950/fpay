import Map "mo:core/Map";
import List "mo:core/List";
import AuthTypes "types/auth";
import TxTypes "types/transactions";
import Common "types/common";

module {
  // ---- Old types (inlined from .old/src/backend/types/auth.mo) ----
  type OldUser = {
    userId : Common.UserId;
    name : Text;
    phone : Common.Phone;
    passwordHash : Text;
    var balance : Nat;
  };

  // ---- Old actor stable state ----
  type OldActor = {
    users : Map.Map<Common.UserId, OldUser>;
    phoneIndex : Map.Map<Common.Phone, Common.UserId>;
    txsByUser : Map.Map<Common.UserId, List.List<TxTypes.Transaction>>;
    userCounter : { var value : Nat };
    txCounter : { var value : Nat };
  };

  // ---- New actor stable state ----
  type NewActor = {
    users : Map.Map<Common.UserId, AuthTypes.User>;
    phoneIndex : Map.Map<Common.Phone, Common.UserId>;
    txsByUser : Map.Map<Common.UserId, List.List<TxTypes.Transaction>>;
    userCounter : { var value : Nat };
    txCounter : { var value : Nat };
  };

  public func run(old : OldActor) : NewActor {
    // Migrate each user: add pin = "0000" and lastInterestTimestamp = 0
    let users = old.users.map<Common.UserId, OldUser, AuthTypes.User>(
      func(_id, u) {
        {
          userId = u.userId;
          name = u.name;
          phone = u.phone;
          passwordHash = u.passwordHash;
          pin = "0000";
          var balance = u.balance;
          var lastInterestTimestamp = 0;
        }
      }
    );
    {
      users;
      phoneIndex = old.phoneIndex;
      txsByUser = old.txsByUser;
      userCounter = old.userCounter;
      txCounter = old.txCounter;
    };
  };
};
