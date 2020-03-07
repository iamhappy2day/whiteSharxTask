import { Request, Response } from 'express';
import {UserService} from './usersService';
import {iUser} from "../../interfaces/iUser";
const userService = new UserService;
import {User} from "./usersModel";
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

    async createUser(req: Request, res: Response) {
        console.log(req.body)
        const newUser: iUser =  await new User({
            name: req.body.name
        });

        await newUser.save();
        res.status(201).send(newUser)
    }
}
