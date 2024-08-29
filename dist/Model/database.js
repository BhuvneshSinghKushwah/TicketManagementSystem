"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
require('dotenv').config();
const pg_1 = require("pg");
const dbConfig = {
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: 5432
};
exports.pool = new pg_1.Pool(dbConfig);
