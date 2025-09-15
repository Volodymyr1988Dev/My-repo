import { Request, Response } from 'express';


export function getUserHandler(req: Request, res: Response) {
  res.json({ user: req.user });
}