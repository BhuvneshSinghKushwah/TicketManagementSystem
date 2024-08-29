"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserPayloadValidation = exports.createUserPayloadValidation = void 0;
const zod_1 = require("zod");
exports.createUserPayloadValidation = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    email: zod_1.z.string().email('Invalid email address'),
    type: zod_1.z.enum(['customer', 'admin']),
    password: zod_1.z.string().min(8, 'Password must be at least 8 characters').regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, 'Password must contain at least one letter, one number, and one special character'),
});
exports.loginUserPayloadValidation = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email/password'),
    password: zod_1.z.string().min(8, 'Invalid email/password').regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, 'Invalid email/password'),
});
