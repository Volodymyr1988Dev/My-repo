import { Request, Response } from 'express';
interface AuthRequest extends Request {
  user?: { id: number; email: string };
}

export function getUserHandler(req: AuthRequest, res: Response) {
  res.json({ user: req.user });
}