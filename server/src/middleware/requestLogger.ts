import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/Logger';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const body = req.body && Object.keys(req.body).length > 0 ? JSON.stringify(req.body) : 'No body';
  logger.info(`${req.method} ${req.originalUrl} - ${body}`);
  
  next();
}