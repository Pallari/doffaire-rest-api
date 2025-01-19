import { Request, Response, NextFunction } from 'express';

export const unCoughtErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  res.end({ error: err });
}

export const apiErrorHandler = (err: any, req: Request, res: Response, message: string) => {
  const error: object = { Message: message, Request: req, Stack: err };
  console.log('hu piyu chhhu', error);
  res.json({ error: error });
}

export const apiSuccessHandler = (res: Response, message: string, data: any) => {
  return res.json({ success: true, message: message || 'API successful.', data: data });
}
