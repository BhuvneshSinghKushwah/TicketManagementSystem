import { Request, Response } from 'express';
import { UserService } from '../Service/userService';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async create(req: Request, res: Response) {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ message: 'Error creating user', error: error.message });
    }
  }

  async loginUser(req: Request, res: Response) {
    try {
      const jwt = await this.userService.loginUser(req.body);
      res.status(200).json(jwt);
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ message: 'Error Logging In User', error: error.message});
    }
  }

  async get(req: Request, res: Response) {
    try {
      const users = await this.userService.getUsers();
      res.status(200).json(users);
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ message: 'Error fetching users', error: error.message});
    }
  }
}