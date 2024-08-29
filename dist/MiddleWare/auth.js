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
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../Model/database");
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const header = req.header('Authorization');
        if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Invalid Authorization header' });
        }
        const token = header.replace('Bearer ', '');
        const key = process.env.JWT_SECRET;
        if (!key) {
            return res.status(500).json({ message: 'Something Went Wrong!' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, key);
        const result = yield database_1.pool.query(`SELECT id, uniq_id, type, name FROM users WHERE uniq_id = $1`, [decoded.uniq_id]);
        if (result.rowCount === 0) {
            throw new Error('User not found');
        }
        req.user_id = result.rows[0].id;
        req.user_uniq_id = result.rows[0].uniq_id;
        req.user_role = result.rows[0].type;
        req.user_name = result.rows[0].name;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Authentication failed', error: error.message });
    }
});
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user_role)) {
            return res.status(403).json({ message: 'Authorization failed' });
        }
        next();
    };
};
exports.authorize = authorize;
