import { z } from "zod";
import { GENDER } from "../user/user.constant";

const userRegisterValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Name is required" }).trim(),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    gender: z.enum(Object.keys(GENDER) as [keyof typeof GENDER]).optional(),
    birthDate: z.string().min(1, { message: "Birth date is required" }).optional(),
    mobileNumber: z.string().min(10, { message: "Mobile number is required" }).optional(),
  }),
});

const userLoginValidationSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string({ required_error: "Password is required" }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: "Old password is required",
    }),
    newPassword: z.string({ required_error: "Password is required" }),
  }),
});
const forgetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address" }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address" }),
    newPassword: z.string({
      required_error: "User new password is required",
    }),
  }),
});
const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: "Refresh token is required!",
    }),
  }),
});

export const AuthValidation = {
  userRegisterValidationSchema,
  userLoginValidationSchema,
  changePasswordValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
  refreshTokenValidationSchema,
};
