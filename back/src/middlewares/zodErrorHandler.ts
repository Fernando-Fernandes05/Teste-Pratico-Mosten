import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export function zodErrorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof z.ZodError) {
    return res.status(400).json({ message: 'Dados inválidos', issues: err.issues });
  }

  return res.status(500).json({ message: 'Erro interno' });
}
