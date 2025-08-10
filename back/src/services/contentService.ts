import { prisma } from '../lib/prisma';
import { VoteType } from '../../generated/prisma';

export class ContentService {
  async list() {
    const [contents, grouped] = await Promise.all([
      prisma.content.findMany({ orderBy: { createdAt: 'asc' } }),
      prisma.vote.groupBy({ by: ['contentId', 'type'], _count: { _all: true } }),
    ]);

    const countsMap: Record<number, { likes: number; dislikes: number }> = {};
    for (const row of grouped as Array<{ contentId: number; type: VoteType; _count: { _all: number } }>) {
      if (!countsMap[row.contentId]) {
        countsMap[row.contentId] = { likes: 0, dislikes: 0 };
      }

      if (row.type === 'LIKE') countsMap[row.contentId].likes = row._count._all;
      if (row.type === 'DISLIKE') countsMap[row.contentId].dislikes = row._count._all;
    }

    return contents.map((c) => ({
      id: c.id,
      title: c.title,
      genre: c.genre,
      description: c.description,
      imageUrl: c.imageUrl,
      likes: countsMap[c.id]?.likes ?? 0,
      dislikes: countsMap[c.id]?.dislikes ?? 0,
      createdAt: c.createdAt,
    }));
  }

  async create(data: { title: string; genre: string; imageUrl: string; description?: string }) {
    const created = await prisma.content.create({ data });
    return created;
  }

  async vote(contentId: number, type: VoteType) {
    const exists = await prisma.content.findUnique({ where: { id: contentId } });
    if (!exists) return null;

    await prisma.vote.create({ data: { contentId, type } });
    return true;
  }
}
