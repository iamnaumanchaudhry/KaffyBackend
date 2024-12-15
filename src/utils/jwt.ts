
import { Token } from "../entities/token";
import { isDevEnv, isProdEnv } from "./helper";
const jwt = require('jsonwebtoken');


const create_jwt = (payload: any, expire: any = 60 * 60 * 24) => {
  const token = jwt.sign(payload, '73cc5d1ebb515e092db1e8073e586a152d3d4f3fb3048e84918db434391dfaded63008e2d14f79b469d0ec11f9c333069176339d74468afc6063a635a79da6fb', { expiresIn: expire });
  return token;
};

const authenticateUserLogin = (req: any): [boolean, any] | undefined => {
  let token: string | undefined = undefined;
  let refresh_token: string | undefined = undefined;
  // check header
  const authHeader: any = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    const split_results: string[] = authHeader.split(' ');
    token = split_results[1];
    refresh_token = split_results[2];
  }
  // check cookies
  else if (req.signedCookies.accessToken || req.signedCookies.refreshToken) {
    token = req.signedCookies.accessToken;
    refresh_token = req.signedCookies.refreshToken;
  }
  try {
    if (token) {
      const { payload } = is_token_valid(token);
      // Attach the user and his permissions to the req object
      return [false, payload]
    } else {
      throw Error("Invalid Token");
    }

  } catch (error) {
    try {
      if (refresh_token) {
        const { payload } = is_token_valid(refresh_token);
        return [true, payload]
      } else {
        return undefined;
      }
    } catch (error) {
      return undefined;
    }
  }
}

const is_token_valid = (token: string) => {
  if (token) {
    try {
      return jwt.verify(token, "73cc5d1ebb515e092db1e8073e586a152d3d4f3fb3048e84918db434391dfaded63008e2d14f79b469d0ec11f9c333069176339d74468afc6063a635a79da6fb");
    } catch (error: any) {
      return null;
    }
  }
  return null;
}

const attach_cookies_to_response = (res: any, user: any, refreshToken: any) => {
  const accessTokenJWT = create_jwt({ payload: { user } }, 60 * 60 * 24);  // 1 day expiry 
  const refreshTokenJWT = create_jwt({ payload: { user, refreshToken } }, 60 * 60 * 24 * 30); // 30 day expiry
  const oneDay: number = 1000 * 60 * 60 * 24; // Access token Expire after one day 
  const longerExp: number = 1000 * 60 * 60 * 24 * 30; // Refresh token has longer time
  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    //  secure: isProdEnv() ||  isDevEnv() ,
    secure: true,
    signed: true,
    expires: new Date(Date.now() + oneDay),
    sameSite: 'None'
  });
  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    secure: true,
    signed: true,
    expires: new Date(Date.now() + longerExp),
    sameSite: 'None'
  });

};

const get_payload = async (access_token: string, refresh_token: string): Promise<any> => {

  const payload: any = is_token_valid(access_token);

  if (payload) {
    return payload.payload;
  }
  else {
    try {
      const payload: any = is_token_valid(refresh_token);
      if (payload) {
        await Token.findOne(payload.payload.user).then(user => {
          if (user.refresh_token === payload.payload.refreshToken) {
            return [payload.payload, user];
          }
        });
      }

      return null;
    } catch (error: any) {
      return null;
    }
  }
};

export {
  create_jwt,
  is_token_valid,
  attach_cookies_to_response,
  get_payload,
  authenticateUserLogin
};
