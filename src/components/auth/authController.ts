import { NextFunction, Response, Request } from 'express';
import { userErrors } from '../../errors/userErrors';
import { iUser } from '../../interfaces/iUser';
import * as jwt from 'jsonwebtoken';
import { config } from '../../config';
import {User} from "../users/usersModel";
import * as bcrypt from 'bcrypt';

export class AuthController {

  async facebookOauth(req: any, res: Response, next: NextFunction) {
    if (req.user) {
      const user = req.user.existingUser;
      const token = signToken(user);
      res.status(200).send({ user, token });
    }
  }

  async userRegister(req: Request, res: Response, next: NextFunction) {
    //Validation of request body

    const emailExists = await User.findOne({
      email: req.body.email
    });

    if(emailExists) {
      return res.status(userErrors.AUTH_ERROR.statusCode).send(
          userErrors.AUTH_ERROR.message)

    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      name: req.body.name,
      company: req.body.company,
      position: req.body.position,
      phone: req.body.phone,
      email: req.body.email,
      authMethod: 'emailAndPassword',
      password: hashedPassword
    });

    try {
      const savedUser = await user.save();
      res.status(201).send(savedUser)
    } catch(err) {
      res.status(400).send(err)
    }
  }

  async userLogin(req: Request, res: Response) {
    //Validation of request body


    const existingUser = await User.findOne({email: req.body.email});
    console.log(existingUser)
    if(!existingUser) {
      return res.status(userErrors.WRONG_EMAIL_ERROR.statusCode).send(
          userErrors.WRONG_EMAIL_ERROR.message
      )
    }

    const validPass = await bcrypt.compare(req.body.password, existingUser.password); //returns true or false
    if(!validPass) {
      return res.status(userErrors.INVALID_PASSWORD_ERROR.statusCode).send(
          userErrors.INVALID_PASSWORD_ERROR.message
      )
    }

    const token = jwt.sign({_id: existingUser._id}, config.JWT_SECRET);


    res.status(200).send({token: token, user: existingUser})
  }
}

export function checkAuthorization(
  req: any,
  res: Response,
  next: NextFunction
) {
  if (
    (req.user && req.params.id == req.user._id) ||
    req.params.ownerId == req.user._id
  ) {
    next();
  } else {
    res.status(401).send(userErrors.UNAUTHORIZED_ERROR);
  }
}

const signToken = (user: iUser) => {
  return jwt.sign(
    {
      userId: user._id,
      iat: new Date().getTime(), //current time
      exp: new Date().setDate(new Date().getDate() + 90) // current time + 90 day ahead
    },
    config.JWT_SECRET
  );
};
