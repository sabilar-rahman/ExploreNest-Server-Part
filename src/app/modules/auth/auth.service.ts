import httpStatus from 'http-status'
import config from '../../config'
import AppError from '../../errors/AppError'
import { TLoginUser } from './auth.interface'
import { User } from '../user/user.model'
import { createToken } from './auth.utils'
import bcrypt from 'bcrypt'
import { TRecoverPassword, TUser } from '../user/user.interface'


export const generateToken = (user: TUser) => {
    const jwtPayload = {
      email: user.email,
      role: user.role,
      status: user.status,
      id: user._id,
    }
  
    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    )
    return accessToken
  }


  const refreshToken = async (id: string) => {
    const user = await User.findById(id)
    if (!user) {
      throw new Error('User not available')
    }
    return generateToken(user)
  }



const loginUser = async (payload: TLoginUser) => {
    // checking if the user is exist
    // console.log(payload)
    const user = await User.isUserExistsByEmail(payload.email)
    // console.log(user)
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !')
    }
  
    //checking if the password is correct
  
    if (!(await User.isPasswordMatched(payload?.password, user?.password)))
      throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched')
  
    //create token and sent to the  client
  
    const jwtPayload = {
      email: user.email,
      role: user.role,
      status: user.status,
      id: user._id,
    }
  
    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    )
  
    return {
      accessToken: accessToken,
      user,
    }
  }
  
  const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))
  }
  
  const recoverPasswordIntoDB = async (payload: TRecoverPassword) => {
    const { email, phone, password } = payload
    const isUserAvailable = await User.findOne({ email })
    if (!isUserAvailable) {
      throw new Error('User not available!')
    }
    if (phone === isUserAvailable.phone) {
      const hashedPassword = await bcrypt.hash(
        password,
        Number(config.bcrypt_salt_rounds),
      )
      const updateUserPassword = await User.findOneAndUpdate(
        { email }, // Find the user by email
        { password: hashedPassword }, // Update the password field
        { new: true }, // Return the updated user
      )
      return updateUserPassword
    } else {
      throw new Error('You are not authorized!')
    }
  }
  
  const changePasswordIntoDB = async (email: string, payload: string) => {
    const hashedPassword = await hashPassword(payload)
    const changeUserPassword = await User.findOneAndUpdate(
      { email }, // Find the user by email
      { password: hashedPassword }, // Update the password field
      { new: true }, // Return the updated user
    )
    return changeUserPassword
  }
  
  export const AuthServices = {
    loginUser,
    recoverPasswordIntoDB,
    changePasswordIntoDB,
    refreshToken
  }