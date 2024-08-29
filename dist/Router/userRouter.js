"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../Controller/userController");
const auth_1 = require("../MiddleWare/auth");
const userRouter = (0, express_1.Router)();
const userController = new userController_1.UserController();
userRouter.get('/', auth_1.authenticate, (0, auth_1.authorize)('admin'), (req, res) => {
    userController.get(req, res);
});
userRouter.post('/', (req, res) => {
    userController.create(req, res);
});
userRouter.post('/auth/login', (req, res) => {
    userController.loginUser(req, res);
});
exports.default = userRouter;
