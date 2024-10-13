import express from 'express'
import { AuthValidation } from './auth.validation'
import { userControllers } from '../user/user.controller'
import { UserValidations } from '../user/user.validation'
import { multerUpload } from '../../config/multer.config'

import { parseBody } from '../../middlewares/bodyParser'
import ValidateRequest from '../../middlewares/ValidateRequest'
import { AuthControllers } from './auth.controller'
import validateImageFile from '../../middlewares/validateImageFile'
import { ImageFilesArrayZodSchema } from '../imageMultipleArrayzodSchema/image.validation'
import auth from '../../middlewares/auth'
import { USER_ROLE } from '../user/user.constant'

const router = express.Router()

router.post(
  '/login',
  ValidateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
)
router.post(
  '/registration',
  multerUpload.fields([{ name: 'image' }]),
  validateImageFile(ImageFilesArrayZodSchema),
  parseBody,
  ValidateRequest(UserValidations.createUserValidationSchema),
  userControllers.createUser,
)



router.put('/recover-password', AuthControllers.passwordRecover)
router.put(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.user),
  AuthControllers.changePassword,
)

//  refresh token
router.post('/refresh-token', AuthControllers.getRefreshToken)




export const AuthRoutes = router