import { Router } from 'express';
import { authenticate, authorize } from '../MiddleWare/auth';
import { TicketController } from '../Controller/ticketController';

const ticketRouter = Router();
const ticketController = new TicketController();

ticketRouter.get('/', (req, res) => {
  // Get all tickets
});

ticketRouter.get('/:id', (req, res) => {
  // Get ticket by id
});

ticketRouter.post('/', authenticate, authorize('admin'), (req, res) => {
  ticketController.createTicket(req, res);
});

ticketRouter.post('/:ticketId/assign', authenticate, authorize('admin'), (req, res) => {
  ticketController.assignTicket(req, res);
});

ticketRouter.delete('/:id', (req, res) => {
  // Delete ticket
});

export default ticketRouter;