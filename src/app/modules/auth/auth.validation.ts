import { z } from 'zod'

const loginValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    img: z.string().optional(),
    email: z.string({ required_error: 'Id is required.' }),
    password: z.string().optional(),
  }),
})

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
})

export const registerUserValidationSchema = z.object({
  body: z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().optional(),
    img: z.string().optional(), // Updated to match schema
  }),
})

export const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string(),
    newPassword: z.string(),
  }),
})

export const forgetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email requires',
    }),
  }),
})
export const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email requires',
    }),
    newPassword: z.string({
      required_error: 'new password is requires',
    }),
  }),
})

export const AuthValidation = {
  loginValidationSchema,
  refreshTokenValidationSchema,
  registerUserValidationSchema,
  changePasswordValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
}