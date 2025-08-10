import { Router } from 'express';
import { listContents, createContent, voteOnContent } from './controllers/contentController';
import { getTotalPositive, getTotalNegative, getTotals } from './controllers/statsController';

export const routes = Router();

routes.get('/health', (_req, res) => res.json({ ok: true }));

routes.get('/contents', listContents);
routes.post('/contents', createContent);
routes.post('/contents/:id/vote', voteOnContent);

routes.get('/stats/positive', getTotalPositive);
routes.get('/stats/negative', getTotalNegative);
routes.get('/stats', getTotals);
