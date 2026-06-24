import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { router } from './routes.js';

const app = express();
const PORT = Number(process.env.PORT ?? 8787);

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') ?? true }));
app.use(express.json({ limit: '1mb' }));

// Seeded-workspace bearer guard. If WORKSPACE_TOKEN is unset (pure local dev),
// the API is open; once set, every /api call must present it.
const TOKEN = process.env.WORKSPACE_TOKEN;
app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next();
  if (!TOKEN) return next();
  const auth = req.header('authorization') ?? '';
  if (auth === `Bearer ${TOKEN}`) return next();
  return res.status(401).json({ error: 'unauthorized' });
});

app.use('/api', router);

app.listen(PORT, () => console.log(`[erynd-server] listening on http://localhost:${PORT}`));
