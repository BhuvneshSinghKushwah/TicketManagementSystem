import { z } from 'zod';

export const createTicketPayloadValidation = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  type: z.enum(['concert', 'conference', 'sports']),
  venue: z.string().min(1, 'Venue is required'),
  status: z.enum(['open', 'in-progress', 'closed']),
  price: z.number().min(0, 'Price must be a non-negative number'),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.string().transform(dateString => new Date(dateString)).refine(date => date > new Date(), 'Due date must be a future date'),
});

export type CreateTicketSchema = z.infer<typeof createTicketPayloadValidation>;