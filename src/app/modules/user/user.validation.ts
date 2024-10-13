import { z } from "zod";

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string().min(10, "Phone number must be valid"),
    role: z.enum(["admin", "user"]),
    address: z.string().optional(),
    // image: z.string().min(1, "Image is required"),
  }),
});

const updateUserValidationSchema = z.object({
  body: z.object({
   
   
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
    phone: z.string().min(10).optional(),
    role: z.enum(['admin', 'user']).optional(),
    address: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const UserValidations = {
  createUserValidationSchema,
  updateUserValidationSchema,
};
