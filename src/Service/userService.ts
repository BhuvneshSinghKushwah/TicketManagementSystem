require('dotenv').config();
import { CreateUserSchema, createUserPayloadValidation } from '../Model/userPayload';
import { LoginUserSchema, loginUserPayloadValidation } from '../Model/userPayload';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { pool } from '../Model/database';
import jwt from 'jsonwebtoken';

export class UserService {
    async createUser(data: CreateUserSchema) {
        const parsedData = createUserPayloadValidation.safeParse(data);
        if (!parsedData.success) {
            throw new Error('Invalid data');
        }
        const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);
        const uniqId = uuidv4();
        const updated_at = new Date();

        await pool.query(`INSERT INTO "users" ("uniq_id", "email", "name", "type", "password", "updated_at") VALUES ($1, $2, $3, $4, $5, $6)`, [uniqId, parsedData.data.email, parsedData.data.name, parsedData.data.type, hashedPassword, updated_at]);

        return { status: true, message: 'User created successfully' };
    }

    async loginUser(data: LoginUserSchema) {
        const parsedData = loginUserPayloadValidation.safeParse(data);
        if (!parsedData.success) {
            throw new Error('Invalid data');
        }

        const result = await pool.query(`SELECT * FROM "users" WHERE "email" = $1`, [parsedData.data.email]);
        if (result.rowCount === 0) {
            throw new Error('User not found');
        }

        const user = result.rows[0];
        const isValidPassword = await bcrypt.compare(parsedData.data.password, user.password);
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
        const token = jwt.sign(payload, key);


        return { status: true, message: 'User logged in successfully', token };
    }

    async getUsers() {
        const result = await pool.query('SELECT * FROM "users";');
        return result.rows;
    }
}