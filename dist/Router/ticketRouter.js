"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../MiddleWare/auth");
const ticketController_1 = require("../Controller/ticketController");
const ticketRouter = (0, express_1.Router)();
const ticketController = new ticketController_1.TicketController();
ticketRouter.get('/:ticketId', auth_1.authenticate, (0, auth_1.authorize)('customer', 'admin'), (req, res) => {
    ticketController.getTicketDetails(req, res);
});
ticketRouter.get('/analytics', auth_1.authenticate, (0, auth_1.authorize)('customer', 'admin'), (req, res) => {
    console.log("Here");
    ticketController.getTicketsAnalytics(req, res);
});
ticketRouter.post('/', auth_1.authenticate, (0, auth_1.authorize)('admin'), (req, res) => {
    ticketController.createTicket(req, res);
});
ticketRouter.post('/:ticketId/assign', auth_1.authenticate, (0, auth_1.authorize)('admin'), (req, res) => {
    ticketController.assignTicket(req, res);
});
exports.default = ticketRouter;
