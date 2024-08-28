"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const userPayload_1 = require("../Model/userPayload");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const prisma = new client_1.PrismaClient();
class UserService {
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedData = userPayload_1.createUserPayloadValidation.safeParse(data);
            if (!parsedData.success) {
                throw new Error('Invalid data');
            }
            const hashedPassword = yield bcrypt_1.default.hash(parsedData.data.password, 10);
            const uniqId = (0, uuid_1.v4)();
            const type = (parsedData.data.type === 'admin') ? client_1.UserType.admin : client_1.UserType.customer;
            yield prisma.$queryRaw `INSERT INTO Users (uniq_id, email, name, type, password) VALUES (${uniqId}, ${parsedData.data.email}, ${parsedData.data.name}, '${client_1.UserType[type]}', ${hashedPassword});`;
            return { status: true, message: 'User created successfully' };
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma.$executeRaw `SELECT * FROM Users;`;
        });
    }
}
exports.UserService = UserService;
