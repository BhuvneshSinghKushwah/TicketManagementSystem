import { pool } from '../Model/database';
import { CreateTicketSchema, createTicketPayloadValidation } from '../Model/ticketPayload';
import { v4 as uuidv4 } from 'uuid';

class TicketService {
    async createTicket(ticket: CreateTicketSchema, user_id: number, user_name: string) {
        const validatedTicket = createTicketPayloadValidation.parse(ticket);

        const uniq_id = uuidv4();
        const updated_at = new Date();

        await pool.query('INSERT INTO "ticket" ("uniq_id", "title", "description", "venue", "status", "price", "priority", "type", "due_date", "updated_at", "created_by") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', [uniq_id, validatedTicket.title, validatedTicket.description, validatedTicket.venue, validatedTicket.status, validatedTicket.price, validatedTicket.priority, validatedTicket.type, validatedTicket.dueDate, updated_at, user_id]);

        return { ticketId: uniq_id, createdBy: user_name, ...validatedTicket };
    }

    async addUserToTicket(ticketId: string, userId: string) {
        if (!ticketId || typeof ticketId !== 'string') {
            throw new Error('Invalid ticketId. It must be a non-empty string.');
        }
        if (!userId || typeof userId !== 'string') {
            throw new Error('Invalid userId. It must be a non-empty string.');
        }

        const ticket_details = await pool.query(`SELECT id, title, status FROM "ticket" WHERE uniq_id = $1`, [ticketId]);
        if (!ticket_details || ticket_details.rows.length == 0) {
            throw new Error(`Invalid Ticket Id`);
        }

        if(ticket_details.rows[0].status === 'closed')
        {
            return {status: "unsuccessful", reason: "Ticket is closed"}
        }

        const user_details = await pool.query(`SELECT id, name FROM "users" WHERE uniq_id = $1`, [userId]);
        if (!user_details || user_details.rows.length == 0) {
            throw new Error(`Invalid User Id`);
        }

        const limit_details = await pool.query(`SELECT count(id) AS limit FROM "ticket_assignee" WHERE ticket_id = $1`, [ticket_details.rows[0].id]);

        if(!limit_details || limit_details.rows.length == 0) {
            throw new Error(`Something Went Wrong While Adding User`);
        }

        if(limit_details.rows[0].limit > 5) {
            return {status: "unsuccessful", reason: "User Limit Exceeded For This Ticket"}
        }
        await pool.query('INSERT INTO "ticket_assignee" ("ticket_id", "user_id") VALUES ($1, $2)', [ticket_details.rows[0].id, user_details.rows[0].id]);

        return {status: "successful", user: user_details.rows[0].name, title: user_details.rows[0].title};
    }
}

export { TicketService };