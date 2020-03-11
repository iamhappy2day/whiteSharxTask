import { NextFunction, Response, Request } from 'express';
import { userErrors } from '../../errors/userErrors';
import { iUser } from '../../interfaces/iUser';
import * as jwt from 'jsonwebtoken';
import { config } from '../../config';
import { User } from '../users/usersModel';
import * as bcrypt from 'bcrypt';
import { addAndUpdateUserValidation } from '../../validation';
import { AuthService } from './authService';

const authService = new AuthService();

export class AuthController {
  async facebookOauth(
    req: any,
    res: Response,
    next: NextFunction
  ) {
    if (req.user) {
      const user = req.user.existingUser;
      const token = signToken(user);
      res.status(200).send({ user, token });
    }
  }

  async userRegister(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    //User validation middleware
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

    const emailExists = await User.findOne({
      email: req.body.email
    });

    if (emailExists) {
      return res
        .status(userErrors.AUTH_ERROR.statusCode)
        .send(userErrors.AUTH_ERROR.message);
    }

    const newUser = await authService.registerUser(
      req.body
    );

    try {
      const savedUser = await newUser.save();
      res.status(201).send(savedUser);
    } catch (err) {
      res.status(400).send(err);
    }
  }

  async userLogin(req: Request, res: Response) {
    const existingUser = await User.findOne({
      email: req.body.email
    });

    if (!existingUser) {
      return res
        .status(userErrors.WRONG_EMAIL_ERROR.statusCode)
        .send(userErrors.WRONG_EMAIL_ERROR.message);
    }

    const validPass = await bcrypt.compare(
      req.body.password,
      existingUser.password
    );
    if (!validPass) {
      return res
        .status(
          userErrors.INVALID_PASSWORD_ERROR.statusCode
        )
        .send(userErrors.INVALID_PASSWORD_ERROR.message);
    }

    const token = jwt.sign(
      { _id: existingUser._id },
      config.JWT_SECRET
    );

    res
      .status(200)
      .send({ token: token, user: existingUser });
  }
}

const signToken = (user: iUser) => {
  return jwt.sign(
    {
      userId: user._id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 90)
    },
    config.JWT_SECRET
  );
};
