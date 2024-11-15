import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../errors/AppError";
import { GENDER } from "../modules/user/user.constant";

export interface IJwtPayload {
  _id: string;
  name: string;
  email: string;
  mobileNumber: string;
  gender: keyof typeof GENDER;
  role: string;
  birthDate: string;
}

// create jwt token
export const createToken = (
  jwtPayload: IJwtPayload,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

// verify jwt token
export const verifyToken = (
  token: string,
  secret: string,
): JwtPayload | Error => {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch (error: any) {
    throw new AppError(401, "You are not authorized!");
  }
};
