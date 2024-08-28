import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../Model/database';

interface Decoded {
  uniq_id: string;
}

const authenticate = async (req: any, res: Response, next: NextFunction) => {
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
    const decoded = jwt.verify(token, key) as Decoded;

    const result = await pool.query(`SELECT id, type, name FROM users WHERE uniq_id = $1`, [decoded.uniq_id]);
    if (result.rowCount === 0) {
      throw new Error('User not found');
    }
    req.user_id = result.rows[0].id as number;
    req.user_role = result.rows[0].type;
    req.user_name = result.rows[0].name;

    next();
  } catch (error: any) {
    return res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};

const authorize = (...roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user_role as string)) {
      return res.status(403).json({ message: 'Authorization failed' });
    }
    next();
  };
};

export { authenticate, authorize };