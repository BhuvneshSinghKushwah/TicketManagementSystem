import { z } from 'zod';

export const createUserPayloadValidation = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  type: z.enum(['customer', 'admin']),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, 'Password must contain at least one letter, one number, and one special character'),
});

export type CreateUserSchema = z.infer<typeof createUserPayloadValidation>;

export const loginUserPayloadValidation = z.object({
  email: z.string().email('Invalid email/password'),
  password: z.string().min(8, 'Invalid email/password').regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, 'Invalid email/password'),
});

export type LoginUserSchema = z.infer<typeof loginUserPayloadValidation>;