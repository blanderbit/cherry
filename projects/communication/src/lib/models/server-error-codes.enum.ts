export enum ServerErrorCodes {
    UserNotFound = 1000,
    TooManyLoginAttempts = 1001,
    EmailAlreadyExist = 1009,
    EmailIsNotConfirmed = 1022,
    EmailAlreadyConfirmed = 1023,
    InvalidToken = 1024,
    EmailVerificationTokenExpired = 1025,
    ResetPasswordTokenExpired = 1026,
    PasswordIsAlreadySet = 1027,
    UserDoesNotBelognToRequestedCompany = 1028,
    UserInitationHasBeenCanceled = 1029,
}
