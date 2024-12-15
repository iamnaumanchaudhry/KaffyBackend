import { UnauthenticatedError } from "../errors/unauthentication-error";
import { attach_cookies_to_response, authenticateUserLogin } from "../utils/jwt";
import { Token } from "../entities/token";

export const authenticateUser = async (req: any, res: any, next: any) => {

  const user_data = authenticateUserLogin(req);

  if (user_data) {
    const [update_cookie, payload] = user_data;

    if (update_cookie) {
      const user_token = await Token.findOne({ user_id: payload.user.user_id });
      if (!user_token) {
        return next(new UnauthenticatedError('Authentication invalid'));
      }
      else {
        if (user_token.refresh_token === payload.refreshToken) {
          attach_cookies_to_response(res, payload.user, user_token.refresh_token);
          req.user = { user_id: payload.user.user_id };
        } else {
          return next(new UnauthenticatedError('Authentication invalid'))
        }
      }
    }
    else {
      req.user = { user_id: payload.user.user_id }
    }
    next();

  } else {
    next(new UnauthenticatedError('Authentication invalid'))
  }
};