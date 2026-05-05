import Common "common";

module {
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;

  public type Transaction = {
    txId : Text;
    senderId : UserId;
    receiverId : UserId;
    amount : Nat; // in paise
    timestamp : Timestamp;
    status : Text; // "Success"
  };

  public type SendMoneyRequest = {
    senderId : UserId;
    receiverIdentifier : Text; // phone or userId
    amount : Nat;
    pin : Text; // 4-digit PIN for transaction authorization
  };

  public type TxError = {
    #insufficientBalance;
    #senderNotFound;
    #receiverNotFound;
    #invalidAmount;
    #selfTransfer;
    #invalidPin;
  };
};
