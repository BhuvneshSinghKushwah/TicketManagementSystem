"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userRouter_1 = __importDefault(require("./Router/userRouter"));
const ticketRouter_1 = __importDefault(require("./Router/ticketRouter"));
const analyticsRouter_1 = __importDefault(require("./Router/analyticsRouter"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something Went Wrong!');
});
app.use('/api/users', userRouter_1.default);
app.use('/api/tickets', ticketRouter_1.default);
app.use('/api/analytics', analyticsRouter_1.default);
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
