import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import catchAsync from "../modules/utils/catchAsync";

import { TUserRole } from "../modules/user/user.interface";
import httpStatus from "http-status";
import { User } from "../modules/user/user.model";




const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    // checking if the token is missing
    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        statusCode: httpStatus.UNAUTHORIZED,
        message: 'You have no access to this route',
      })
    }
    // checking if the given token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload

    const { role, email } = decoded

    // console.log(email)

    // checking if the user is exist
    const user = await User.isUserExistsByEmail(email)

    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        statusCode: httpStatus.UNAUTHORIZED,
        message: 'You have no access to this route',
      })
    }
    // checking if the user is already deleted

    if (requiredRoles && !requiredRoles.includes(role)) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        statusCode: httpStatus.UNAUTHORIZED,
        message: 'You have no access to this route',
      })
    }

    req.user = decoded as JwtPayload
    next()
  })
}

export default auth
