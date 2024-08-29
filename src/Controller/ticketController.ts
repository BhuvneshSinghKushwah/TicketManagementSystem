import { Response } from 'express';
import { TicketService } from '../Service/ticketService';

class TicketController {
    private ticketService: TicketService;

    constructor() {
        this.ticketService = new TicketService();
    }

    async getTicketsAnalytics(req: any, res: Response) {
        try {
            const anayltics = await this.ticketService.ticketsAnalytics(req.query);
            res.status(201).json(anayltics);
        } catch (error: any) {
            console.log(error);
            res.status(400).json({ message: 'Error Getting Tickets Analytics Details', error: error.message });
        }
    }

    async getTicketDetails(req: any, res: Response) {
        try {
            const ticket = await this.ticketService.getTicket(req.params.ticketId);
            res.status(201).json(ticket);
        } catch (error: any) {
            console.log(error);
            res.status(400).json({ message: 'Error Getting Ticket Details', error: error.message });
        }
    }

    async createTicket(req: any, res: Response) {
        try {
            const ticket = await this.ticketService.createTicket(req.body, req.user_uniq_id);
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