import { Response, Request, NextFunction } from 'express';
import { userErrors } from './userErrors';

export function catchErrors(
  func: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await func(req, res, next);
    } catch (e) {
      console.log(e);
      if (e.code === 11000) {
        res.status(400).send({
          type: userErrors.DUPLICATE_KEY_ERROR.type,
          statusCode: userErrors.DUPLICATE_KEY_ERROR.statusCode,
          message: e.message
        });
      } else {
        res.status(400).send({
          type: 'Unhandled Error',
          statusCode: '400',
          message: e.message
        });
      }
    }
  };
}
