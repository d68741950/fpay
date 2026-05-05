module {
  public type UserId = Text; // 8-char alphanumeric
  public type Phone = Text;
  public type Timestamp = Int; // nanoseconds from Time.now()

  public type Result<T, E> = { #ok : T; #err : E };
};
