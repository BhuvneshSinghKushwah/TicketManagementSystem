require('dotenv').config();
import { Pool } from 'pg';

const dbConfig = {
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432
};

export const pool = new Pool(dbConfig);