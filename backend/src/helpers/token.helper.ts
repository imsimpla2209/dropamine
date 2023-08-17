import {sign, verify} from 'jsonwebtoken';

export const generateJWToken = (payload: any, secret: any, expires: any) => {
  return sign(payload, secret, {
    expiresIn: expires,
  });
};

export const verifyJWTToken = (token: any, secret: any) => {
  return verify(token, secret);
};
