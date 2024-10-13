import { Router } from 'express'
import { AuthControllers } from './auth.controller'

import { AuthValidation } from './auth.validation'
import validateRequest from '../../middlewares/ValidateRequest'

const router = Router()

router.put(
  '/change-password/:email',
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthControllers.changePassword,
)

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
)

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
)
router.post(
  '/register',
  validateRequest(AuthValidation.registerUserValidationSchema),
  AuthControllers.registerUser,
)

// forget password
router.post(
  '/forget-password',
  validateRequest(AuthValidation.forgetPasswordValidationSchema),
  AuthControllers.forgetPassword,
)
// reset password
router.post(
  '/reset-password',
  validateRequest(AuthValidation.resetPasswordValidationSchema),
  AuthControllers.resetPassword,
)

// last login
router.put('/last-login/:userId', AuthControllers.updateLastLogin)

export const AuthRoutes = router