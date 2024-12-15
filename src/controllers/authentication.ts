import { Response, NextFunction, Request } from "express";
import { HttpStatusCode, OtpVerificationType } from "../utils/enums";
import { create_json_response, error_formatting, generateOtpAndSendEmail } from "../utils/helper";
import { APIError } from "../errors/api-error";
import { DBConnection } from "../db/mysql/connect";
import { User } from "../entities/user";
import { Token } from "../entities/token";
import { UnauthenticatedError } from "../errors/unauthentication-error";
import { attach_cookies_to_response } from "../utils/jwt";
import { NotifyUser } from "../dto/notify_user";
import { notify_user } from "../utils/notifications/notify_user";
import { SendOtpEmailBody } from "../utils/notifications/email_bodies";
import bcrypt from "bcryptjs";

const speakeasy = require("speakeasy");
const crypto = require('crypto');

const getProfile = async (req: any, res: Response, next: NextFunction) => {
    try {

        const { user_id } = req.user;
        if (!user_id) return next(new APIError("[Get Profile]", HttpStatusCode.BAD_REQUEST, true, "Please sign in first.", "Please Sign-in first."))

        const user = await User.findOne({ where: { id: user_id } });

        res.status(HttpStatusCode.OK).json({ ...create_json_response(user, true, `Profile fetched.`), })

    } catch (error: any) {
        next(new APIError("[Get Profile]", HttpStatusCode.BAD_REQUEST, true, error_formatting(error), "Something went wrong!"))
    }
}

const signup = async (req: any, res: Response, next: NextFunction) => {
    try {

        const { password, email, username } = req.body;

        // Check if user already exist
        const existing_user = await User.findOne({ where: { email } })
        if (existing_user && existing_user?.is_verified == true) return next(new APIError("[User Signup]", HttpStatusCode.BAD_REQUEST, true, "User with specific email already exist, Please sign in", "User with specific email already exist, Please Sign-in"))

        // If user exist but not verified then send otp again
        if (existing_user && existing_user?.is_verified == false) {
            const otp = generateOtpAndSendEmail(email);
            existing_user.otp_secret = JSON.stringify(otp?.secret);
            await existing_user.save();
            let email_body = SendOtpEmailBody(otp?.token, existing_user?.email)
            let input_val: NotifyUser = {
                Email: {
                    subject: email_body.subject,
                    to_email: [email],
                    body: email_body.body
                }
            }
            notify_user(input_val)
            return res.status(HttpStatusCode.OK).json({ ...create_json_response({ "user_id": existing_user?.id }, true, `Account with this email already exist, Please check your email for otp.`), otp: otp.token })
        }

        // If user not exist then create
        const queryRunner = DBConnection.get_db_connection().createQueryRunner();
        await queryRunner.startTransaction();
        try {

            const hashedPassword = await bcrypt.hash(password, 12);

            const new_user = User.create({ email, password: hashedPassword, username, created_at: new Date(), updated_at: new Date() })

            const otp = generateOtpAndSendEmail(email);
            new_user.otp_secret = JSON.stringify(otp?.secret);

            await queryRunner.manager.save(new_user);

            // commit transaction now:
            await queryRunner.commitTransaction();

            let email_body = SendOtpEmailBody(otp?.token, new_user?.email)
            let input_val: NotifyUser = {
                Email: {
                    subject: email_body.subject,
                    to_email: [email],
                    body: email_body.body
                }
            }
            notify_user(input_val)

            res.status(HttpStatusCode.OK).json({ ...create_json_response({ "user_id": new_user?.id }, true, `Otp has been sent to your email`), otp: otp.token })

        } catch (error: any) {
            // since we have errors let's rollback changes we made
            await queryRunner.rollbackTransaction();
            next(new APIError("[User Signup]", HttpStatusCode.BAD_REQUEST, true, error_formatting(error), "Invalid data for adding User"))
        } finally {
            // you need to release query runner which is manually created:
            await queryRunner.release();
        }

    } catch (err: any) {
        return next(new APIError("[User Signup]", HttpStatusCode.BAD_REQUEST, true, error_formatting(err), "Something went wrong"));
    }

}

const login = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        // Find the user based on the provided email
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(HttpStatusCode.UNAUTHORIZED).json(create_json_response({}, false, "Invalid credentials"));

        if (user.is_verified == false) return res.status(HttpStatusCode.UNAUTHORIZED).json(create_json_response({}, false, "Email is not verified"));

        const isPasswordCorrect = await bcrypt.compare(password, user?.password!);
        if (!isPasswordCorrect) return res.status(HttpStatusCode.UNAUTHORIZED).json(create_json_response({}, false, "Invalid credentials"));

        let user_data = { user_id: user.id, email: user.email };
        await existing_token_check(req, res, next, user_data)

        return res.status(HttpStatusCode.OK).json(create_json_response(user_data, true, "Login successful"));

    } catch (err: any) {
        return next(new APIError("[User Login]", HttpStatusCode.BAD_REQUEST, true, error_formatting(err), "Something went wrong"));
    }
};

const verify_otp = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { user_id, otp, type } = req.body;

        const user = await User.findOne({ where: { id: user_id } });
        if (!user) return res.status(HttpStatusCode.NOT_FOUND).json(create_json_response({}, false, "User not found"));

        const secret = JSON.parse(user.otp_secret); // You need to retrieve the secret saved during registration
        const isValidOTP = speakeasy.totp.verify({
            secret: secret.base32,
            encoding: 'base32',
            token: otp,
            window: 2, // Allow for a time window of 2 intervals in case of clock drift
        });

        if (isValidOTP) {
            // OTP is valid, you can perform further actions here
            if (type == OtpVerificationType.SIGNUP) {
                user.is_verified = true;
            }
            else if (type == OtpVerificationType.FORGETPASSWORD) {
                user.forget_password_request = true
            }
            await user.save();

            return res.status(HttpStatusCode.OK).json(create_json_response({ user_id, email: user.email }, true, "OTP verified successfully"));
        } else {
            return res.status(HttpStatusCode.UNAUTHORIZED).json(create_json_response({}, false, "Invalid OTP"));
        }

    } catch (err: any) {
        return next(new APIError("[Verify OTP]", HttpStatusCode.BAD_REQUEST, true, error_formatting(err), "Something went wrong"));
    }
};

const forget_password_request = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;

        // Find the user based on the provided email
        const user = await User.findOne({ email });
        if (!user) return res.status(HttpStatusCode.NOT_FOUND).json(create_json_response({}, false, "User not found"));

        // Generate OTP
        const otp = generateOtpAndSendEmail(email); // Implement a function to generate OTP and send an email
        user.otp_secret = JSON.stringify(otp?.secret);
        await user.save()
        let email_body = SendOtpEmailBody(otp?.token, user?.email)
        let input_val: NotifyUser = {
            Email: {
                subject: email_body.subject,
                to_email: [email],
                body: email_body.body
            }
        }
        notify_user(input_val)

        return res.status(HttpStatusCode.OK).json(create_json_response({ user_id: user.id, email, otp }, true, "OTP sent successfully"));

    } catch (err: any) {
        return next(new APIError("[Forget Password Request]", HttpStatusCode.BAD_REQUEST, true, error_formatting(err), "Something went wrong"));
    }
};

const forget_password_update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user_id, new_password } = req.body;

        // Find the user based on the provided email
        const user = await User.findOne({ id: user_id });
        if (!user) return res.status(HttpStatusCode.NOT_FOUND).json(create_json_response({}, false, "User not found"));

        if (!user.forget_password_request) return res.status(HttpStatusCode.UNAUTHORIZED).json(create_json_response({}, false, "Authorization Failed"));

        // Update password 
        user.password = await bcrypt.hash(new_password, 12);
        user.forget_password_request = false;
        await user.save();

        return res.status(HttpStatusCode.OK).json(create_json_response({}, true, "Password updated successfully"));

    } catch (err: any) {
        return next(new APIError("[Forget Password Update]", HttpStatusCode.BAD_REQUEST, true, error_formatting(err), "Something went wrong"));
    }
};

const logout = async (req: any, res: Response, next: NextFunction) => {
    try {

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            // secure: isProdEnv() ||  isDevEnv() ,
            signed: true,
            sameSite: 'none'
        });
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: true,
            // secure: isProdEnv() ||  isDevEnv() ,
            signed: true,
            sameSite: 'none'
        });
        return res.status(200).json(create_json_response({}, true, "Successfully logout"));
    } catch (err: any) {
        return next(new APIError("[Logout]", HttpStatusCode.BAD_REQUEST, true, error_formatting(err), "Something went wrong"));
    }

}

// Login Helper
const existing_token_check = async (req: Request, res: Response, next: NextFunction, user_data: any) => {
    let refresh_token = '';

    const existing_token = await Token.findOne({ user_id: user_data?.user_id });
    if (existing_token) {
        if (!existing_token.is_valid) {
            return next(new UnauthenticatedError("Invalid Credentials"));
        }
        refresh_token = existing_token.refresh_token;
    } else {
        refresh_token = crypto.randomBytes(40).toString('hex');
        const user_agent = req.headers['user-agent'];
        const ip = req.ip;
        const user_token = { refresh_token, ip, user_agent, user_id: user_data?.user_id };
        const token = Token.create(user_token)
        await token.save();
    }

    attach_cookies_to_response(res, user_data, refresh_token);

    return res.status(HttpStatusCode.OK)
}

export {
    getProfile,
    signup,
    verify_otp,
    login,
    logout,
    forget_password_request,
    forget_password_update,
}