export enum HttpStatusCode {
    OK = 200,
    BAD_REQUEST = 400,
    NOT_FOUND = 404,
    INTERNAL_SERVER = 500,
    UNAUTHORIZED = 401,
    UNPROCESSABLE_ENTITY = 422,
    CONFLICT = 409
}

export enum OtpVerificationType {
    SIGNUP = 0,
    FORGETPASSWORD = 1,
}

export enum SubmissionStatus {
    PENDING = 0,
    COMPLETED = 1,
    REJECTED = 2,
}