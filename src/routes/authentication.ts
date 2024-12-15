import express, { Router } from "express";
import { authenticateUser } from "../middleware/authentication";
import { validate_request_schema } from "../middleware/validate-requests";
import { logout, forget_password_request, forget_password_update, login, signup, verify_otp, getProfile } from "../controllers/authentication";
import { user_forget_password_request_checks, user_forget_password_update_checks, user_login_checks, user_signup_checks, user_verify_otp_checks } from "../validation/authentication";

const router: Router = express.Router();

router.get('/profile', validate_request_schema, authenticateUser, getProfile);
router.post('/signup', user_signup_checks, validate_request_schema, signup);
router.post('/login', user_login_checks, validate_request_schema, login);
router.post('/verify-otp', user_verify_otp_checks, validate_request_schema, verify_otp);
router.post('/forget-pw-request', user_forget_password_request_checks, validate_request_schema, forget_password_request);
router.post('/forget-pw-update', user_forget_password_update_checks, validate_request_schema, forget_password_update);

router.post('/logout', authenticateUser, logout);

export default router; 