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
require('dotenv').config();
const userPayload_1 = require("../Model/userPayload");
const userPayload_2 = require("../Model/userPayload");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const database_1 = require("../Model/database");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserService {
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedData = userPayload_1.createUserPayloadValidation.parse(data);
            const hashedPassword = yield bcrypt_1.default.hash(parsedData.password, 10);
            const uniqId = (0, uuid_1.v4)();
            const updated_at = new Date();
            yield database_1.pool.query(`INSERT INTO "users" ("uniq_id", "email", "name", "type", "password", "updated_at") VALUES ($1, $2, $3, $4, $5, $6)`, [uniqId, parsedData.email, parsedData.name, parsedData.type, hashedPassword, updated_at]);
            return { status: true, message: 'User created successfully', userId: uniqId };
        });
    }
    loginUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedData = userPayload_2.loginUserPayloadValidation.parse(data);
            const result = yield database_1.pool.query(`SELECT * FROM "users" WHERE "email" = $1`, [parsedData.email]);
            if (result.rowCount === 0) {
                throw new Error('User not found');
            }
            const user = result.rows[0];
            const isValidPassword = yield bcrypt_1.default.compare(parsedData.password, user.password);
            if (!isValidPassword) {
                throw new Error('Invalid password');
            }
            const payload = {
                uniq_id: user.uniq_id,
                exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours expiration
            };
            const key = process.env.JWT_SECRET;
            if (!key) {
                throw new Error('Something Went Wrong!');
            }
            const token = jsonwebtoken_1.default.sign(payload, key);
            return { status: true, message: 'User logged in successfully', token };
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield database_1.pool.query('SELECT * FROM "users";');
            return result.rows;
        });
    }
}
exports.UserService = UserService;
