"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticketRouter = (0, express_1.Router)();
ticketRouter.get('/', (req, res) => {
    // Get all tickets
});
ticketRouter.get('/:id', (req, res) => {
    // Get ticket by id
});
ticketRouter.post('/', (req, res) => {
    // Create new ticket
});
ticketRouter.put('/:id', (req, res) => {
    // Update ticket
});
ticketRouter.delete('/:id', (req, res) => {
    // Delete ticket
});
exports.default = ticketRouter;
