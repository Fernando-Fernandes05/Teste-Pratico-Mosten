import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { VoteType } from '../../generated/prisma';
import { ContentService } from '../services/contentService';

const contentService = new ContentService();

export async function listContents(_req: Request, res: Response, next: NextFunction) {
  try {
    const payload = await contentService.list();
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
    const created = await contentService.create(data);
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

    const ok = await contentService.vote(contentId, type as VoteType);
    if (!ok) return res.status(404).json({ message: 'Conteúdo não encontrado' });
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
}
