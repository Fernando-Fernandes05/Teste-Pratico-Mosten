"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listContents = listContents;
exports.createContent = createContent;
exports.voteOnContent = voteOnContent;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
function mapCountsByType(counts) {
    const map = {};
    for (const row of counts) {
        if (!map[row.contentId])
            map[row.contentId] = { likes: 0, dislikes: 0 };
        if (row.type === 'LIKE')
            map[row.contentId].likes = row._count._all;
        if (row.type === 'DISLIKE')
            map[row.contentId].dislikes = row._count._all;
    }
    return map;
}
async function listContents(_req, res, next) {
    try {
        const [contents, grouped] = await Promise.all([
            prisma_1.prisma.content.findMany({ orderBy: { createdAt: 'asc' } }),
            prisma_1.prisma.vote.groupBy({ by: ['contentId', 'type'], _count: { _all: true } }),
        ]);
        const countsMap = mapCountsByType(grouped);
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
    }
    catch (err) {
        next(err);
    }
}
async function createContent(req, res, next) {
    const schema = zod_1.z.object({
        title: zod_1.z.string().min(1),
        genre: zod_1.z.string().min(1),
        imageUrl: zod_1.z.string().url(),
        description: zod_1.z.string().optional().default(''),
    });
    try {
        const data = schema.parse(req.body);
        const created = await prisma_1.prisma.content.create({ data });
        res.status(201).json({ id: created.id });
    }
    catch (err) {
        next(err);
    }
}
async function voteOnContent(req, res, next) {
    const paramsSchema = zod_1.z.object({ id: zod_1.z.string().regex(/^\d+$/) });
    const bodySchema = zod_1.z.object({ type: zod_1.z.enum(['LIKE', 'DISLIKE']) });
    try {
        const { id } = paramsSchema.parse(req.params);
        const { type } = bodySchema.parse(req.body);
        const contentId = Number(id);
        const exists = await prisma_1.prisma.content.findUnique({ where: { id: contentId } });
        if (!exists)
            return res.status(404).json({ message: 'Conteúdo não encontrado' });
        await prisma_1.prisma.vote.create({ data: { contentId, type: type } });
        res.status(201).json({ ok: true });
    }
    catch (err) {
        next(err);
    }
}
