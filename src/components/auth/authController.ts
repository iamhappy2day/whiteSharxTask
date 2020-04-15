import { NextFunction, Response, Request } from 'express';
import { userErrors } from '../../errors/userErrors';
import { iUser } from '../../interfaces/iUser';
import * as jwt from 'jsonwebtoken';
import { config } from '../../config';
import { User } from '../users/usersModel';
import * as bcrypt from 'bcryptjs';
import {
  addAndUpdateUserValidation,
  resetPasswordValidation
} from '../../validation';
import { AuthService } from './authService';
import { sendEmail } from '../../middlewares/email';

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
            error: error.message
          });
      return;
    }
    const emailExists = await User.findOne({
      email: req.body.email
    });
    console.log(emailExists)
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

  async updatePassword(req: Request, res: Response) {
    const result = await authService.updatePassword(
      req.body.id,
      req.body.oldPassword,
      req.body.newPassword,
      req.body.newPasswordConfirm
    );
    console.log('result',result)
  }

  async userLogin(req: Request, res: Response) {
    if (!req.body.email || !req.body.password) {
      throw Error('Please provide email and password');
    }
    const existingUser = await User.findOne({
      email: req.body.email
    }).select('+password');

    if (!existingUser) {
      return res
        .status(userErrors.WRONG_EMAIL_ERROR.statusCode)
        .send(userErrors.WRONG_EMAIL_ERROR.message);
    }
    console.log(req.body.password)
    console.log(existingUser.password)
  // const validPass =  await bcryptjs.compare(
  //     req.body.password,
  //     existingUser.password,
  //   )

    bcrypt.compare(req.body.password, existingUser.password, function(err, result) {
      if (err) { throw (err); }
      console.log(result);
    });
    // console.log(validPass)

    const token = jwt.sign(
      { _id: existingUser._id },
      config.JWT_SECRET,
      {
        expiresIn: config.JWT_EXPIRES_IN
      }
    );

    res
      .status(200)
      .send({ token: token, user: existingUser });
  }

  async forgetPassword(req: Request, res: Response) {
    const resetToken = await authService.forgetPassword(
      req.body.email
    );

    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/auth/resetPassword/${resetToken}`;
    console.log(resetUrl);
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to:
    ${resetUrl}.\n If you didn't forget your password, please ignore this email`;
    try {
      await sendEmail({
        email: req.body.email,
        subject:
          'You password reset token (valid for 10 min)',
        message: message
      });
      res.status(200).send({
        status: 'success',
        message: 'Token send to email!'
      });
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
  async resetPassword(req: Request, res: Response) {
    //Reset Password validation Data
    const { error } = resetPasswordValidation(req.body);
    if (error) {
      res
        .status(userErrors.VALIDATION_ERROR.statusCode)
        .send({
          error: error.message
        });
      return;
    }

    const user = await authService.resetPassword(
      req.params.token,
      req.body.password,
      req.body.passwordConfirm
    );

    const token = signToken(user);
    res.status(200).send({ token: token, user: user });
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
