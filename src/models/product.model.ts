import { z } from 'zod';

// Product entity schema
export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  price: z.number().positive(),
  category: z.string().min(1).max(50),
  imageUrl: z.string().url().optional(),
  inStock: z.boolean().default(true),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Create product request schema (without ID, createdAt, updatedAt)
export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update product request schema (all fields optional except ID)
export const UpdateProductSchema = ProductSchema.partial().required({ id: true });

// Types derived from schemas
export type Product = z.infer<typeof ProductSchema>;
export type CreateProductRequest = z.infer<typeof CreateProductSchema>;
export type UpdateProductRequest = z.infer<typeof UpdateProductSchema>; 