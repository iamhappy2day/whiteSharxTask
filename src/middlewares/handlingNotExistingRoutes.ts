import { NextFunction, Response, Request } from 'express';

export function checkIfRouteExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(404).send({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`
  });
}
