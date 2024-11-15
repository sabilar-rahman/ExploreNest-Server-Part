import { z } from "zod";
import { GENDER } from "./user.constant";

// export const userRegisterSchema = z.object({
//   body: z.object({
//     name: z.string().min(1, { message: "Name is required" }).trim(),
//     email: z.string().email({ message: "Invalid email address" }),
//     password: z
//       .string()
//       .min(6, { message: "Password must be at least 6 characters long" }),
//     gender: z.enum(Object.keys(GENDER) as [keyof typeof GENDER]),
//     profileImage: z
//       .string()
//       .url()
//       .optional()
//       .default("https://i.ibb.co.com/vkVW6s0/download.png"),
//     bio: z.string().optional(),
//     birthDate: z.string().min(1, { message: "Birth date is required" }),
//     mobileNumber: z.string().min(10, { message: "Mobile number is required" }),
//     address: z.string().min(1, { message: "Address is required" }),
//     isVerified: z.boolean().optional().default(false),
//     followers: z.array(z.string().optional()).optional(),
//     following: z.array(z.string().optional()).optional(),
//   }),
// });

export const userRegisterSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    gender: z.enum(Object.keys(GENDER) as [keyof typeof GENDER]).optional(),
    profileImage: z.string().url().optional(),
    bio: z.string().optional(),
    birthDate: z.string().optional(),
    mobileNumber: z.string().optional(),
    address: z.string().optional(),
    isVerified: z.boolean().optional().default(false),
    followers: z.array(z.string()).optional(),
    following: z.array(z.string()).optional(),
  }),
});

// export const userUpdateSchema = z.object({
//   body: z.object({
//     name: z.string().min(1, { message: "Name is required" }).trim().optional(),
//     gender: z.enum(Object.keys(GENDER) as [keyof typeof GENDER]).optional(),
//     profileImage: z
//       .string()
//       .url({ message: "Invalid profile image URL" })
//       .optional()
//       .default("https://i.ibb.co/vkVW6s0/download.png"),
//     bio: z.string().optional(),
//     birthDate: z
//       .string()
//       .min(1, { message: "Birth date is required" })
//       .optional(),
//     mobileNumber: z
//       .string()
//       .min(10, { message: "Mobile number must be at least 10 digits" })
//       .optional(),
//     address: z.string().optional(),
//   }),
// });

export const userUpdateSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: "Name is required" }).trim().optional(),

    profileImage: z
      .string()
      .url({ message: "Invalid profile image URL" })
      .optional(),
  }),
});
