"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTicketPayloadValidation = void 0;
const zod_1 = require("zod");
exports.createTicketPayloadValidation = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    description: zod_1.z.string().min(1, 'Description is required'),
    type: zod_1.z.enum(['concert', 'conference', 'sports']),
    venue: zod_1.z.string().min(1, 'Venue is required'),
    status: zod_1.z.enum(['open', 'in-progress', 'closed']),
    price: zod_1.z.number().min(0, 'Price must be a non-negative number'),
    priority: zod_1.z.enum(['low', 'medium', 'high']),
    dueDate: zod_1.z.string().transform(dateString => new Date(dateString)).refine(date => date > new Date(), 'Due date must be a future date'),
});
