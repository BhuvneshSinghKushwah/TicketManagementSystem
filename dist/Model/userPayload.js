"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserPayloadValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.createUserPayloadValidation = zod_1.z.object({
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    type: zod_1.z.nativeEnum(client_1.UserType),
    password: zod_1.z.string().min(8).regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/),
});
