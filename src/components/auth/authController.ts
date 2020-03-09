import { NextFunction, Response, Request } from 'express';
import { userErrors } from '../../errors/userErrors';
import { iUser } from '../../interfaces/iUser';
import * as JWT from 'jsonwebtoken';
import { config } from '../../config';

export class AuthController {
  async facebookOauth(req: any, res: Response, next: NextFunction) {
    if (req.user) {
      const user = req.user.existingUser;
      const token = signToken(user);
      res.status(200).send({ user, token });
    }
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
  return JWT.sign(
    {
      userId: user._id,
      iat: new Date().getTime(), //current time
      exp: new Date().setDate(new Date().getDate() + 90) // current time + 90 day ahead
    },
    config.JWT_SECRET
  );
};
