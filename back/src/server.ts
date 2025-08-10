import express from 'express';
import cors from 'cors';
import { routes } from './routes';
import { zodErrorHandler } from './middlewares/zodErrorHandler';

const app = express();

app.use(cors({
  origin: 'null'
}));
app.use(express.json());
app.use(routes);

app.use(zodErrorHandler);

const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;
app.listen(PORT, () => {
  console.log(`HTTP server running on http://localhost:${PORT}`);
});
