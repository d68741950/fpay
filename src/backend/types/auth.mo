import Common "common";

module {
  public type UserId = Common.UserId;
  public type Phone = Common.Phone;

  public type User = {
    userId : UserId;
    name : Text;
    phone : Phone;
    passwordHash : Text;
    pin : Text; // 4-digit PIN for transaction authorization
    var balance : Nat; // in paise (₹1000 = 100000)
    var lastInterestTimestamp : Int; // nanoseconds, for daily interest accrual
  };

  // Shared (no var fields) version returned to the frontend
  public type UserPublic = {
    userId : UserId;
    name : Text;
    phone : Phone;
    balance : Nat;
  };

  public type RegisterRequest = {
    name : Text;
    phone : Phone;
    password : Text;
    pin : Text; // 4-digit PIN
  };

  public type LoginRequest = {
    phone : Phone;
    password : Text;
  };

  public type AuthError = {
    #phoneTaken;
    #invalidCredentials;
    #userNotFound;
  };
};
