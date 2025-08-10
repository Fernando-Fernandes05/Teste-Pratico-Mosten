import { prisma } from '../lib/prisma';

export class StatsService {
  async getTotalPositive() {
    return prisma.vote.count({ where: { type: 'LIKE' } });
  }

  async getTotalNegative() {
    return prisma.vote.count({ where: { type: 'DISLIKE' } });
  }

  async getTotals() {
    const [totalPositive, totalNegative] = await Promise.all([
      prisma.vote.count({ where: { type: 'LIKE' } }),
      prisma.vote.count({ where: { type: 'DISLIKE' } }),
    ]);
    return { totalPositive, totalNegative };
  }
}
