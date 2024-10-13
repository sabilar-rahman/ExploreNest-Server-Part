import httpStatus from 'http-status'
import catchAsync from '../utils/catchAsync'
import { AuthServices } from './auth.service'
import sendResponse from '../utils/sendResponse'
import { getUserInfoFromToken } from '../utils/getUserInfoFromToken'


const loginUser = catchAsync(async (req, res) => {
    const result = await AuthServices.loginUser(req.body)
    const { accessToken, user } = result

    res.cookie('refreshToken', accessToken, {
        httpOnly: true,
      })
    
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User logged in successfully',
      accessToken: accessToken,
      data: user,
    })
  })




  const getRefreshToken = catchAsync(async (req, res) => {
    const token = req.headers.authorization
    const { id } = getUserInfoFromToken(token as string)
    const result = await AuthServices.refreshToken(id)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Refresh token generated successfully',
      data: result,
    })
  })


const passwordRecover = catchAsync(async (req, res) => {
    const payload = await req.body
  
    const result = await AuthServices.recoverPasswordIntoDB(payload)
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User password recovered successfully',
      data: result,
    })
  })
  
  const changePassword = catchAsync(async (req, res) => {
    const token = req.headers.authorization
    const { email } = getUserInfoFromToken(token as string)
    const { password } = req.body
    const result = await AuthServices.changePasswordIntoDB(email, password)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Password updated successfully',
      data: result,
    })
  })
  

export const AuthControllers = {
  loginUser,
  changePassword,
  passwordRecover,


  getRefreshToken,
}