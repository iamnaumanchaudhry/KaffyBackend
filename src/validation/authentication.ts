import { check } from "express-validator"


export const user_signup_checks = [
    check('password', 'password does not exist.').not().isEmpty(),
    check('username', 'usernamee does not exist.').not().isEmpty(),
    check('email', 'email does not exist.').not().isEmpty()
]
export const user_login_checks = [
    check('email', 'email does not exist.').not().isEmpty(),
    check('password', 'password does not exist.').not().isEmpty()
]
export const user_verify_otp_checks = [
    check('user_id', 'user_id does not exist.').not().isEmpty(),
    check('otp', 'otp does not exist.').not().isEmpty(),
    check('type', 'type does not exist.').not().isEmpty(),
]
export const user_forget_password_request_checks = [
    check('email', 'email does not exist.').not().isEmpty()
]
export const user_forget_password_update_checks = [
    check('user_id', 'user_id does not exist.').not().isEmpty(),
    check('new_password', 'new_password does not exist.').not().isEmpty()
]