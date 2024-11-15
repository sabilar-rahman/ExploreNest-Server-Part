import httpStatus from "http-status";
import { USER_ROLE } from "../modules/user/user.constant";
import { catchAsync } from "../utils/catchAsync";
import { verifyToken } from "../utils/jwtVerification";
import config from "../config";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import AppError from "../errors/AppError";

const auth = (...requiredRoles: (keyof typeof USER_ROLE)[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;

    // checking if the token is given
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    // verifying the token and decoding it to get the user information
    const decoded = verifyToken(
      token,
      config.access_secret as string,
    ) as JwtPayload;

    const { role, email, iat } = decoded;

    // checking if the user is exist
    const user = await User.isUserExistsByEmail(email);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
    }

    // checking if the user is already blocked by admin
    const status = user?.status;

    if (status === "BLOCKED") {
      throw new AppError(httpStatus.FORBIDDEN, "This user is blocked !");
    }

    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number,
      )
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized !");
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized");
    }

    req.user = decoded;
    next();
  });
};

export default auth;
