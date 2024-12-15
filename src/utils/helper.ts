import { QueryFailedError } from "typeorm"
const speakeasy = require("speakeasy");
import path from "path";

export const isDevEnv = () => {
    return process.env.NODE_ENV === "development"
}
export function isProdEnv() {
    return process.env.NODE_ENV === "production"
}
export function create_json_response(data: any = {}, success: boolean = true, message: string = "") {
    return {
        data: data,
        success: success,
        message: message
    }
}

export const error_formatting = (error: any) => {
    let formatted_error;
    if (error instanceof QueryFailedError) {
        formatted_error = { 'message': error.message, 'query': error.query }
    }
    else {
        formatted_error = { 'message': error.message, 'lineNumber': error.lineNumber }
    }
    return JSON.stringify(formatted_error);
}

export const generateOtpAndSendEmail = (email: any) => {
    let secret = speakeasy.generateSecret({ length: 20 });
    let token = speakeasy.totp({ secret: secret.base32, encoding: 'base32' });

    // send email logic goes here
    return { 'token': token, "secret": secret };
}

export const check_file_type = (file: any) => {
    const filetypes = /.pdf/;
    const extname = filetypes.test(path.extname(file.name).toLowerCase());
    if (extname) {
        return true;
    }
    return false;
}
 