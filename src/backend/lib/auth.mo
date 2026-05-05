import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Nat32 "mo:core/Nat32";
import Char "mo:core/Char";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Types "../types/auth";
import Common "../types/common";

module {
  // Simple deterministic hash for passwords (not cryptographic, demo only)
  public func hashPassword(password : Text) : Text {
    var hash : Nat = 5381;
    for (c in password.toIter()) {
      let code = c.toNat32().toNat();
      hash := (hash * 33 + code) % 2147483647;
    };
    hash.toText()
  };

  // Generate unique 8-char alphanumeric user ID from a seed
  public func generateUserId(seed : Nat) : Common.UserId {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let charsArr = chars.toArray();
    let len = charsArr.size();
    var id = "";
    var s = seed + 1; // avoid zero seed
    for (_ in Nat.range(0, 8)) {
      let idx = s % len;
      id := id # Text.fromChar(charsArr[idx]);
      s := (s * 1664525 + 1013904223) % 4294967296;
    };
    id
  };

  public func toPublic(user : Types.User) : Types.UserPublic {
    {
      userId = user.userId;
      name = user.name;
      phone = user.phone;
      balance = user.balance;
    }
  };

  // Register a new user; returns #err if phone already taken
  public func register(
    users : Map.Map<Common.UserId, Types.User>,
    phoneIndex : Map.Map<Common.Phone, Common.UserId>,
    req : Types.RegisterRequest,
    nextId : Nat,
  ) : Common.Result<Types.UserPublic, Types.AuthError> {
    // Check duplicate phone
    switch (phoneIndex.get(req.phone)) {
      case (?_) { return #err(#phoneTaken) };
      case null {};
    };

    let userId = generateUserId(nextId);
    let now = Time.now();
    let user : Types.User = {
      userId;
      name = req.name;
      phone = req.phone;
      passwordHash = hashPassword(req.password);
      pin = req.pin;
      var balance = 100_000; // ₹1,000 in paise
      var lastInterestTimestamp = now;
    };

    users.add(userId, user);
    phoneIndex.add(req.phone, userId);
    #ok(toPublic(user))
  };

  // Login; returns user public data or error
  public func login(
    users : Map.Map<Common.UserId, Types.User>,
    phoneIndex : Map.Map<Common.Phone, Common.UserId>,
    req : Types.LoginRequest,
  ) : Common.Result<Types.UserPublic, Types.AuthError> {
    switch (phoneIndex.get(req.phone)) {
      case null { #err(#invalidCredentials) };
      case (?uid) {
        switch (users.get(uid)) {
          case null { #err(#userNotFound) };
          case (?user) {
            if (user.passwordHash == hashPassword(req.password)) {
              #ok(toPublic(user))
            } else {
              #err(#invalidCredentials)
            }
          };
        }
      };
    }
  };

  // Lookup user by userId or phone
  public func getUser(
    users : Map.Map<Common.UserId, Types.User>,
    phoneIndex : Map.Map<Common.Phone, Common.UserId>,
    identifier : Text,
  ) : ?Types.UserPublic {
    // Try direct userId lookup first
    switch (users.get(identifier)) {
      case (?user) { return ?toPublic(user) };
      case null {};
    };
    // Try phone lookup
    switch (phoneIndex.get(identifier)) {
      case null { null };
      case (?uid) {
        switch (users.get(uid)) {
          case null { null };
          case (?user) { ?toPublic(user) };
        }
      };
    }
  };
};
