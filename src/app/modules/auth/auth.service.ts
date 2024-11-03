import httpStatus from 'http-status'
import config from '../../config'

import bcryptJs from 'bcryptjs'

import { TChangePassword, TLoginUser } from './auth.interface'
// import { createToken, verifyToken } from './auth.utils'

import { User } from '../user/user.model'
import AppError from '../../errors/AppError'
import { USER_ROLE } from '../user/user.utils'
import { sendEmail } from '../utils/sendEmail'




const registerUser = async (userData: TLoginUser) => {
  if (userData.password) {
    userData.password = await bcryptJs.hash(
      userData.password,
      Number(config.bcrypt_salt_rounds),
    )
  }
  const user = await User.create({
    ...userData,
    role: USER_ROLE.user,
  })

  return user
}


const loginUser = async (payload: TLoginUser) => {
  // checking if the user is exist
  const user = await User.findOne({ email: payload.email })
  if (!user) {
    const user = await registerUser(payload)

    const jwtPayload = {
      email: user.email,
      role: user.role,
      userId: user._id.toString(), // convert ObjectId to string
    }

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    )

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string,
    )
    return {
      accessToken,
      refreshToken,
      // added this user to the response
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  } else {
    if (payload.password) {
      const isPasswordMatched = await bcryptJs.compare(
        payload.password,
        user.password,
      )

      if (!isPasswordMatched) {
        throw new AppError(httpStatus.NOT_FOUND, 'Password Incorrect!')
      }
    }
    const jwtPayload = {
      _id: user._id,
      name: user.name,  
      email: user.email,
      role: user.role,
      img: user.img,
      verified: user.verified,
      followers: user.followers,
      following: user.following,
      


    }

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    )

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string,
    )

    return {
      accessToken,
      refreshToken,
    }
  }
}

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string)

  const { email } = decoded

  // checking if the user is exist
  const user = await User.findOne({ email: email })

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !')
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  }

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  )

  return {
    accessToken,
  }
}



const changePasswordToDB = async (payload: TChangePassword, email: string) => {
  const user = await User.findOne({ email })
  const isPasswordMatched = await bcryptJs.compare(
    payload.oldPassword,
    user!.password,
  )
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.NOT_FOUND, 'Password Incorrect!')
  }
  user!.password = await bcryptJs.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds),
  )
  const res = await user?.save()
  return res
}



// forget password
const forgetPassword = async (email: string) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new AppError(404, 'User not found!')
  }
  const jwtPayload = {
    email: user.email,
    role: user.role,
  }

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m',
  )
  const resetLink = `${config.reset_password_ui_link}?email=${user.email}&token=${resetToken}`
  sendEmail(user?.email, resetLink)
}



// reset password
const resetPassword = async (
  payload: { email: string; newPassword: string },
  token: string,
) => {
  const user = await User.findOne({ email: payload?.email })
  if (!user) {
    throw new AppError(404, 'User not found!')
  }
  const decoded = verifyToken(token, config.jwt_access_secret as string)
  const { email, role } = decoded
  if (email !== payload?.email) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden')
  }
  const hashedPassword = await bcryptJs.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds),
  )
  await User.findOneAndUpdate({ email, role }, { password: hashedPassword })
}

const updateLastLogin = async (userId: string) => {
  await User.findByIdAndUpdate(userId, { lastLogin: new Date() })
}

export const AuthServices = {
  loginUser,
  refreshToken,
  registerUser,
  changePasswordToDB,
  forgetPassword,
  resetPassword,
  updateLastLogin,
}