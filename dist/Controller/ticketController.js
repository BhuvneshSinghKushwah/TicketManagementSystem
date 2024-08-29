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
exports.TicketController = void 0;
const ticketService_1 = require("../Service/ticketService");
class TicketController {
    constructor() {
        this.ticketService = new ticketService_1.TicketService();
    }
    getTicketsAnalytics(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const anayltics = yield this.ticketService.ticketsAnalytics(req.query);
                res.status(201).json(anayltics);
            }
            catch (error) {
                console.log(error);
                res.status(400).json({ message: 'Error Getting Tickets Analytics Details', error: error.message });
            }
        });
    }
    getTicketDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ticket = yield this.ticketService.getTicket(req.params.ticketId);
                res.status(201).json(ticket);
            }
            catch (error) {
                console.log(error);
                res.status(400).json({ message: 'Error Getting Ticket Details', error: error.message });
            }
        });
    }
    createTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ticket = yield this.ticketService.createTicket(req.body, req.user_uniq_id);
                res.status(201).json(ticket);
            }
            catch (error) {
                console.log(error);
                res.status(400).json({ message: 'Error creating ticket', error: error.message });
            }
        });
    }
    assignTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const assignTicket = yield this.ticketService.addUserToTicket(req.params.ticketId, req.body.userId);
                res.status(201).json(assignTicket);
            }
            catch (error) {
                if (error.message.includes("duplicate key value violates unique constraint")) {
                    res.status(400).json({ status: false, message: "User is already assigned to this ticket" });
                }
                else {
                    console.log(error);
                    res.status(400).json({ message: 'Error Assigning Ticket', error: error.message });
                }
            }
        });
    }
}
exports.TicketController = TicketController;
