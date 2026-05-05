import Map "mo:core/Map";
import AuthLib "../lib/auth";
import Types "../types/auth";
import Common "../types/common";

mixin (
  users : Map.Map<Common.UserId, Types.User>,
  phoneIndex : Map.Map<Common.Phone, Common.UserId>,
  userCounter : { var value : Nat },
) {

  /// Register a new user. Returns user data on success, or an error.
  public func register(req : Types.RegisterRequest) : async Common.Result<Types.UserPublic, Types.AuthError> {
    let result = AuthLib.register(users, phoneIndex, req, userCounter.value);
    switch (result) {
      case (#ok(_)) { userCounter.value += 1 };
      case (#err(_)) {};
    };
    result
  };

  /// Login with phone + password.
  public func login(req : Types.LoginRequest) : async Common.Result<Types.UserPublic, Types.AuthError> {
    AuthLib.login(users, phoneIndex, req)
  };

  /// Lookup a user by userId or phone number (for receiver resolution).
  public query func getUser(identifier : Text) : async ?Types.UserPublic {
    AuthLib.getUser(users, phoneIndex, identifier)
  };
};
