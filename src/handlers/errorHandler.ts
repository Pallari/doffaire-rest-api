import { Request, Response, NextFunction } from 'express';
import winston from 'winston';

export const unCoughtErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  winston.error(JSON.stringify(err));
  res.end({ error: err });
}

export const apiErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  message: string,
) => {
  const error: object = { Message: message, Request: req, Stack: err };
  winston.error(JSON.stringify(error));
  res.json({ Message: message });
}
