import { Router } from 'express';
import { authenticate, authorize } from '../MiddleWare/auth';
import { TicketController } from '../Controller/ticketController';

const ticketRouter = Router();
const ticketController = new TicketController();

ticketRouter.get('/analytics', authenticate, authorize('customer', 'admin'), (req, res) => {
  ticketController.getTicketsAnalytics(req, res);
});

ticketRouter.get('/:ticketId', authenticate, authorize('customer', 'admin'), (req, res) => {
  ticketController.getTicketDetails(req, res);
});

ticketRouter.post('/', authenticate, authorize('admin'), (req, res) => {
  ticketController.createTicket(req, res);
});

ticketRouter.post('/:ticketId/assign', authenticate, authorize('admin'), (req, res) => {
  ticketController.assignTicket(req, res);
});

export default ticketRouter;