require('dotenv').config();
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import userRouter from './Router/userRouter';
import ticketRouter from './Router/ticketRouter';
import analyticsRouter from './Router/analyticsRouter';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something Went Wrong!');
});

app.use('/api/users', userRouter);
app.use('/api/tickets', ticketRouter);
app.use('/api/dashboard', analyticsRouter);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});