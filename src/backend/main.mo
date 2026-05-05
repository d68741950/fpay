import Map "mo:core/Map";
import List "mo:core/List";
import AuthTypes "types/auth";
import TxTypes "types/transactions";
import Common "types/common";
import AuthMixin "mixins/auth-api";
import TxMixin "mixins/transactions-api";
import Migration "migration";

(with migration = Migration.run)
actor {
  // --- Shared state ---
  let users = Map.empty<Common.UserId, AuthTypes.User>();
  let phoneIndex = Map.empty<Common.Phone, Common.UserId>();
  let txsByUser = Map.empty<Common.UserId, List.List<TxTypes.Transaction>>();

  // Monotonic counters
  let userCounter = { var value : Nat = 0 };
  let txCounter = { var value : Nat = 0 };

  // --- Mixins ---
  include AuthMixin(users, phoneIndex, userCounter);
  include TxMixin(users, phoneIndex, txsByUser, txCounter);
};
