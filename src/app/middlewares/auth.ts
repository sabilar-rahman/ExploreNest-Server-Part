// import { NextFunction, Request, Response } from 'express'
// import httpStatus from 'http-status'
// import jwt, { JwtPayload } from 'jsonwebtoken'
// import config from '../config'
// import catchAsync from '../modules/utils/catchAsync'
// import { USER_ROLE } from '../modules/user/user.utils'
// import AppError from '../errors/AppError'
// import { User } from '../modules/user/user.model'


// const auth = (...requiredRoles: (keyof typeof USER_ROLE)[]) => {
//   return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const token = req.headers.authorization

//     // checking if the token is missing
//     if (!token) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
//     }

//     // checking if the given token is valid
//     const decoded = jwt.verify(
//       token,
//       config.jwt_access_secret as string,
//     ) as JwtPayload

//     const { role, email } = decoded

//     // checking if the user is exist
//     const user = await User.findOne({ email })

//     if (!user) {
//       throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !')
//     }

//     // there need iat for password change at





//     if (requiredRoles && !requiredRoles.includes(role)) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized  hi!')
//     }

//     req.user = decoded as JwtPayload & { role: string }
//     next()
//   })
// }

// export default auth




import { NextFunction, Request, Response } from 'express';

import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';

import catchAsync from '../modules/utils/catchAsync';
import { USER_ROLE } from '../modules/user/user.utils';


const auth = (...requiredRoles : (keyof typeof USER_ROLE)[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        
       const token = req.headers.authorization;

       // Check if there is any token sent by the client or not.
       if(!token){
           throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized to proceed!')
        }

        // Check if the token is valid or not.
        jwt.verify(token, config.jwt_access_secret as string, function(err, decoded) {
            // err
            if(err){
                throw new AppError(httpStatus.UNAUTHORIZED, 'You have no access to this route')
            };



            const role = (decoded as JwtPayload).role

            if(requiredRoles && !requiredRoles.includes(role)){
                throw new AppError(httpStatus.UNAUTHORIZED, 'You have no access to this route')
            }
            // decoded undefined
            req.user = decoded as JwtPayload;
            next();
          });

       
})
};

export default auth;