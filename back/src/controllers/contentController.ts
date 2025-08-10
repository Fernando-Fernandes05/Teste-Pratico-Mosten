import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { VoteType } from '../../generated/prisma';

function mapCountsByType(counts: Array<{ contentId: number; type: VoteType; _count: { _all: number } }>) {
  const map: Record<number, { likes: number; dislikes: number }> = {};
  for (const row of counts) {
    if (!map[row.contentId]) {
      map[row.contentId] = { likes: 0, dislikes: 0 };
    }

    if (row.type === 'LIKE') {
      map[row.contentId].likes = row._count._all;
    }

    if (row.type === 'DISLIKE') {
      map[row.contentId].dislikes = row._count._all;
    }
  }

  return map;
}

export async function listContents(_req: Request, res: Response, next: NextFunction) {
  try {
    const [contents, grouped] = await Promise.all([
      prisma.content.findMany({ orderBy: { createdAt: 'asc' } }),
      prisma.vote.groupBy({ by: ['contentId', 'type'], _count: { _all: true } }),
    ]);

    const countsMap = mapCountsByType(grouped as any);

    const payload = contents.map((c) => ({
      id: c.id,
      title: c.title,
      genre: c.genre,
      description: c.description,
      imageUrl: c.imageUrl,
      likes: countsMap[c.id]?.likes ?? 0,
      dislikes: countsMap[c.id]?.dislikes ?? 0,
      createdAt: c.createdAt,
    }));

    res.json(payload);
  } catch (err) {
    next(err);
  }
}

export async function createContent(req: Request, res: Response, next: NextFunction) {
  const schema = z.object({
    title: z.string().min(1),
    genre: z.string().min(1),
    imageUrl: z.url(),
    description: z.string().optional().default(''),
  });

  try {
    const data = schema.parse(req.body);
    const created = await prisma.content.create({ data });

    res.status(201).json({ id: created.id });
  } catch (err) {
    next(err);
  }
}

export async function voteOnContent(req: Request, res: Response, next: NextFunction) {
  const paramsSchema = z.object({ id: z.string().regex(/^\d+$/) });
  const bodySchema = z.object({ type: z.enum(['LIKE', 'DISLIKE']) });

  try {
    const { id } = paramsSchema.parse(req.params);
    const { type } = bodySchema.parse(req.body);
    const contentId = Number(id);

    const exists = await prisma.content.findUnique({ where: { id: contentId } });
    if (!exists) {
      return res.status(404).json({ message: 'Conteúdo não encontrado' });
    }

    await prisma.vote.create({ data: { contentId, type: type as VoteType } });

    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
}
