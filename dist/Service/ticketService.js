"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketService = void 0;
const database_1 = require("../Model/database");
const ticketPayload_1 = require("../Model/ticketPayload");
const uuid_1 = require("uuid");
class TicketService {
    ticketsAnalytics(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { startDate, endDate, status, priority, type, venue } = query;
            const ticket_details = yield database_1.pool.query(`SELECT * FROM ticket`);
            const filteredTickets = ticket_details.rows.filter(ticket => {
                if (startDate && ticket.created_at < startDate)
                    return false;
                if (endDate && ticket.created_at > endDate)
                    return false;
                if (status && ticket.status !== status)
                    return false;
                if (priority && ticket.priority !== priority)
                    return false;
                if (type && ticket.type !== type)
                    return false;
                if (venue && ticket.venue !== venue)
                    return false;
                return true;
            });
            const analytics = this.generateAnalytics(filteredTickets);
            return analytics;
        });
    }
    generateAnalytics(tickets) {
        const totalTickets = tickets.length;
        const closedTickets = tickets.filter(ticket => ticket.status === 'closed').length;
        const openTickets = tickets.filter(ticket => ticket.status === 'open').length;
        const inProgressTickets = tickets.filter(ticket => ticket.status === 'in-progress').length;
        const priorityDistribution = tickets.reduce((acc, ticket) => {
            acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
            return acc;
        }, {});
        const typeDistribution = tickets.reduce((acc, ticket) => {
            acc[ticket.type] = (acc[ticket.type] || 0) + 1;
            return acc;
        }, {});
        return {
            totalTickets,
            closedTickets,
            openTickets,
            inProgressTickets,
            priorityDistribution,
            typeDistribution,
            tickets
        };
    }
    getTicket(ticketId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(ticketId);
            if (!ticketId || typeof ticketId !== 'string') {
                throw new Error('Invalid ticketId. It must be a non-empty string.');
            }
            const ticket_details = yield database_1.pool.query(`SELECT t.*, u.name AS user_name FROM "ticket" t JOIN users u ON u.uniq_id = t.created_by WHERE t.uniq_id = $1`, [ticketId]);
            if (!ticket_details || ticket_details.rows.length == 0) {
                throw new Error(`Invalid Ticket Id`);
            }
            const user_details = yield database_1.pool.query(`SELECT u.uniq_id, u.name, u.email FROM users u JOIN ticket_assignee ta ON ta.user_id = u.id WHERE ta.ticket_id = $1`, [ticket_details.rows[0].id]);
            const response = {
                "id": ticket_details.rows[0].uniq_id,
                "title": ticket_details.rows[0].title,
                "description": ticket_details.rows[0].description,
                "type": ticket_details.rows[0].type,
                "venue": ticket_details.rows[0].venue,
                "status": ticket_details.rows[0].status,
                "price": ticket_details.rows[0].price,
                "priority": ticket_details.rows[0].priority,
                "dueDate": ticket_details.rows[0].due_date,
                "createdBy": ticket_details.rows[0].created_by,
                "assignees": user_details.rows.map(user => ({
                    "id": user.uniq_id,
                    "name": user.name,
                    "email": user.email
                })),
                "statistics": {
                    "totalAssigned": user_details.rows.length,
                    "status": ticket_details.rows[0].status
                }
            };
            return response;
        });
    }
    createTicket(ticket, user_uniq_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const validatedTicket = ticketPayload_1.createTicketPayloadValidation.parse(ticket);
            const uniq_id = (0, uuid_1.v4)();
            const updated_at = new Date();
            yield database_1.pool.query('INSERT INTO "ticket" ("uniq_id", "title", "description", "venue", "status", "price", "priority", "type", "due_date", "updated_at", "created_by") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)', [uniq_id, validatedTicket.title, validatedTicket.description, validatedTicket.venue, validatedTicket.status, validatedTicket.price, validatedTicket.priority, validatedTicket.type, validatedTicket.dueDate, updated_at, user_uniq_id]);
            return Object.assign({ ticketId: uniq_id, createdBy: user_uniq_id }, validatedTicket);
        });
    }
    addUserToTicket(ticketId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ticketId || typeof ticketId !== 'string') {
                throw new Error('Invalid ticketId. It must be a non-empty string.');
            }
            if (!userId || typeof userId !== 'string') {
                throw new Error('Invalid userId. It must be a non-empty string.');
            }
            const ticket_details = yield database_1.pool.query(`SELECT id, title, status FROM "ticket" WHERE uniq_id = $1`, [ticketId]);
            if (!ticket_details || ticket_details.rows.length == 0) {
                throw new Error(`Invalid Ticket Id`);
            }
            if (ticket_details.rows[0].status === 'closed') {
                return { status: "unsuccessful", reason: "Ticket is closed" };
            }
            const user_details = yield database_1.pool.query(`SELECT id, name FROM "users" WHERE uniq_id = $1`, [userId]);
            if (!user_details || user_details.rows.length == 0) {
                throw new Error(`Invalid User Id`);
            }
            const limit_details = yield database_1.pool.query(`SELECT count(id) AS limit FROM "ticket_assignee" WHERE ticket_id = $1`, [ticket_details.rows[0].id]);
            if (!limit_details || limit_details.rows.length == 0) {
                throw new Error(`Something Went Wrong While Adding User`);
            }
            if (limit_details.rows[0].limit >= 5) {
                return { status: "unsuccessful", reason: "User Limit Exceeded For This Ticket" };
            }
            yield database_1.pool.query('INSERT INTO "ticket_assignee" ("ticket_id", "user_id") VALUES ($1, $2)', [ticket_details.rows[0].id, user_details.rows[0].id]);
            return { status: "successful", user: user_details.rows[0].name, title: ticket_details.rows[0].title };
        });
    }
}
exports.TicketService = TicketService;
