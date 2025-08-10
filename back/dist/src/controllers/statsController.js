"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalPositive = getTotalPositive;
exports.getTotalNegative = getTotalNegative;
exports.getTotals = getTotals;
const prisma_1 = require("../lib/prisma");
async function getTotalPositive(_req, res, next) {
    try {
        const totalPositive = await prisma_1.prisma.vote.count({ where: { type: 'LIKE' } });
        res.json({ totalPositive });
    }
    catch (err) {
        next(err);
    }
}
async function getTotalNegative(_req, res, next) {
    try {
        const totalNegative = await prisma_1.prisma.vote.count({ where: { type: 'DISLIKE' } });
        res.json({ totalNegative });
    }
    catch (err) {
        next(err);
    }
}
async function getTotals(_req, res, next) {
    try {
        const [totalPositive, totalNegative] = await Promise.all([
            prisma_1.prisma.vote.count({ where: { type: 'LIKE' } }),
            prisma_1.prisma.vote.count({ where: { type: 'DISLIKE' } }),
        ]);
        res.json({ totalPositive, totalNegative });
    }
    catch (err) {
        next(err);
    }
}
