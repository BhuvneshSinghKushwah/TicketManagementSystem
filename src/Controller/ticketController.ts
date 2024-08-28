import { Response } from 'express';
import { TicketService } from '../Service/ticketService';

class TicketController {
    private ticketService: TicketService;

    constructor() {
        this.ticketService = new TicketService();
    }

    async createTicket(req: any, res: Response) {
        try {
            const ticket = await this.ticketService.createTicket(req.body, req.user_id, req.user_name);
            res.status(201).json(ticket);
        } catch (error: any) {
            console.log(error);
            res.status(400).json({ message: 'Error creating ticket', error: error.message });
        }
    }

    async assignTicket(req: any, res: Response) {
        try {
            const assignTicket = await this.ticketService.addUserToTicket(req.params.ticketId, req.body.userId);
            res.status(201).json(assignTicket);
        } catch (error: any) {
            if (error.message.includes("duplicate key value violates unique constraint")) {
                res.status(400).json({ status: false, message: "User is already assigned to this ticket" });
            } else {
                console.log(error);
                res.status(400).json({ message: 'Error Assigning Ticket', error: error.message});
            }
        }
    }
}

export { TicketController };