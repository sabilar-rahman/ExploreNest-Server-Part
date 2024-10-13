import httpStatus from 'http-status'
import { AuthServices } from './auth.service'
import catchAsync from '../utils/catchAsync'
import sendResponse from '../utils/sendResponse'


const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body)
  const { refreshToken, accessToken } = result

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in successfully!',
    data: {
      accessToken,
      refreshToken,
    },
  })
})

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies
  const result = await AuthServices.refreshToken(refreshToken)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved successfully!',
    data: result,
  })
})
const registerUser = catchAsync(async (req, res) => {
  const result = await AuthServices.registerUser(req.body)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User registered successfully',
    data: result,
  })
})

// change password
const changePassword = catchAsync(async (req, res) => {
  const { email } = req.params
  const result = await AuthServices.changePasswordToDB(req.body, email)
  sendResponse(res, {
    success: true,
    message: 'Password changed successfully',
    statusCode: 200,
    data: result,
  })
})

// forget password
const forgetPassword = catchAsync(async (req, res) => {
  const userEmail = req.body.email
  const result = await AuthServices.forgetPassword(userEmail)
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Reset link is generated successfully',
    data: result,
  })
})

// reset password
const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization
  const result = await AuthServices.resetPassword(req.body, token as string)
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Password reset successfully',
    data: result,
  })
})

const updateLastLogin = catchAsync(async (req, res) => {
  const userId = req.params.userId
  await AuthServices.updateLastLogin(userId)
  sendResponse(res, {
    success: true,
    message: 'User last login updated successfully',
    statusCode: 200,
    data: null,
  })
})

export const AuthControllers = {
  loginUser,
  refreshToken,
  registerUser,
  changePassword,
  forgetPassword,
  resetPassword,
  updateLastLogin,
}