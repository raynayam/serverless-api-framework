import { z } from 'zod';

// User entity schema
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  password: z.string().min(8).max(100),
  role: z.enum(['user', 'admin']).default('user'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Create user request schema (without ID, createdAt, updatedAt)
export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update user request schema (all fields optional except ID)
export const UpdateUserSchema = UserSchema.partial().required({ id: true });

// Login request schema
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Register request schema
export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
});

// User response schema (without password)
export const UserResponseSchema = UserSchema.omit({ password: true });

// Types derived from schemas
export type User = z.infer<typeof UserSchema>;
export type CreateUserRequest = z.infer<typeof CreateUserSchema>;
export type UpdateUserRequest = z.infer<typeof UpdateUserSchema>;
export type LoginRequest = z.infer<typeof LoginSchema>;
export type RegisterRequest = z.infer<typeof RegisterSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>; 