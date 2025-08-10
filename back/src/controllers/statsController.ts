import { Request, Response, NextFunction } from 'express';
import { StatsService } from '../services/statsService';

const statsService = new StatsService();

export async function getTotalPositive(_req: Request, res: Response, next: NextFunction) {
  try {
    const totalPositive = await statsService.getTotalPositive();

    res.json({ totalPositive });
  } catch (err) {
    next(err);
  }
}

export async function getTotalNegative(_req: Request, res: Response, next: NextFunction) {
  try {
    const totalNegative = await statsService.getTotalNegative();

    res.json({ totalNegative });
  } catch (err) {
    next(err);
  }
}

export async function getTotals(_req: Request, res: Response, next: NextFunction) {
  try {
    const totals = await statsService.getTotals();
    res.json(totals);
  } catch (err) {
    next(err);
  }
}
