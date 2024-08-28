"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analyticsRouter = (0, express_1.Router)();
analyticsRouter.get('/dashboard', (req, res) => {
    // Get analytics dashboard data
});
analyticsRouter.get('/reports', (req, res) => {
    // Get analytics reports
});
exports.default = analyticsRouter;
