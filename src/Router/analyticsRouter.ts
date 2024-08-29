import { Router } from 'express';
import { authenticate, authorize } from '../MiddleWare/auth';
import { AnalyticsController } from '../Controller/analyticsController';

const ticketRouter = Router();
const ticketController = new AnalyticsController();

ticketRouter.get('/analytics', authenticate, authorize('customer', 'admin'), (req, res) => {
  ticketController.getAnalytics(req, res);
});

export default ticketRouter;