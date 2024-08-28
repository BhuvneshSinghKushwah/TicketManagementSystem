"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../Controller/userController");
const userRouter = (0, express_1.Router)();
const userController = new userController_1.UserController();
userRouter.get('/', (req, res) => {
    userController.get(req, res);
});
userRouter.get('/:id', (req, res) => {
    // Get user by id
});
userRouter.post('/', (req, res) => {
    userController.create(req, res);
});
userRouter.put('/:id', (req, res) => {
    // Update user
});
userRouter.delete('/:id', (req, res) => {
    // Delete user
});
exports.default = userRouter;
