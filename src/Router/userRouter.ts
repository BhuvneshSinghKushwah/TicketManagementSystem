import { Router } from 'express';
import { UserController } from '../Controller/userController';
import { authenticate, authorize } from '../MiddleWare/auth';

const userRouter = Router();
const userController = new UserController();

userRouter.get('/', authenticate, authorize('admin'), (req, res) => {
  userController.get(req, res);
});

userRouter.post('/', (req, res) => {
  userController.create(req, res);
});

userRouter.post('/auth/login', (req, res) => {
  userController.loginUser(req, res);
})

export default userRouter;