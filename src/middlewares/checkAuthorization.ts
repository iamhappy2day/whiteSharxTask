import { NextFunction, Response } from 'express';
import { userErrors } from '../errors/userErrors';

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
