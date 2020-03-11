import { Request, Response } from 'express';
import { UserService } from './usersService';
import { addAndUpdateUserValidation } from '../../validation';
import { userErrors } from '../../errors/userErrors';
const userService = new UserService();

export class UserController {
  async getUsers(req: Request, res: Response) {
    const users = await userService.getUsers();
    res.status(200).send(users);
  }

  async getUserById(req: Request, res: Response) {
    const targetUser = await userService.getUserById(
      req.params.id
    );
    res.status(200).send(targetUser);
  }

  async updateUser(req: Request, res: Response) {
    //Middleware for validation user updates
    const { error } = addAndUpdateUserValidation(req.body);
    if (error) {
      res
        .status(userErrors.VALIDATION_ERROR.statusCode)
        .send({
          Code: userErrors.VALIDATION_ERROR.statusCode,
          Type: userErrors.VALIDATION_ERROR.type,
          Description:
            userErrors.VALIDATION_ERROR.message +
            ': ' +
            error.details[0].message
        });
      return;
    }

    const updatedUser = await userService.updateUser(
      req.body,
      req.params.id
    );

    res.status(201).send(updatedUser);
  }

  async deleteUser(req: Request, res: Response) {
    const deletedUser = await userService.deleteUser(
      req.params.id
    );
    res.status(200).send(deletedUser);
  }
}
