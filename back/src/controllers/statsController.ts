import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export async function getTotalPositive(_req: Request, res: Response, next: NextFunction) {
  try {
    const totalPositive = await prisma.vote.count({ where: { type: 'LIKE' } });

    res.json({ totalPositive });
  } catch (err) {
    next(err);
  }
}

export async function getTotalNegative(_req: Request, res: Response, next: NextFunction) {
  try {
    const totalNegative = await prisma.vote.count({ where: { type: 'DISLIKE' } });

    res.json({ totalNegative });
  } catch (err) {
    next(err);
  }
}

export async function getTotals(_req: Request, res: Response, next: NextFunction) {
  try {
    const [totalPositive, totalNegative] = await Promise.all([
      prisma.vote.count({ where: { type: 'LIKE' } }),
      prisma.vote.count({ where: { type: 'DISLIKE' } }),
    ]);

    res.json({ totalPositive, totalNegative });
  } catch (err) {
    next(err);
  }
}
