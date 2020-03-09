import { Request, Response } from 'express';
import { UserService } from './usersService';
const userService = new UserService();

export class UserController {
  async getUsers(req: Request, res: Response) {
    const users = await userService.getUsers();
    res.status(200).send(users);
  }

  async getUserById(req: Request, res: Response) {
    const targetUser = await userService.getUserById(req.params.id);
    res.status(200).send(targetUser);
  }

  async updateUser(req: Request, res: Response) {
    const updatedUser = await userService.updateUser(req.body, req.params.id);
    res.status(201).send(updatedUser);
  }

  async deleteUser(req: Request, res: Response) {
    const deletedUser = await userService.deleteUser(req.params.id);
    res.status(200).send(deletedUser);
  }
}
