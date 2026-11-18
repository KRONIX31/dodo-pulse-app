import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ensureStore, getReviews, saveReviews, resetReviews } from './store.js';
import { classifyReview } from '../shared/classify.js';

const app = express();
const PORT = Number(process.env.PORT || 3001);
const rootDir = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(rootDir, '../dist');

app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.get('/api/reviews', async (_req, res, next) => {
  try {
    const reviews = await getReviews();
    res.json({ reviews });
  } catch (error) {
    next(error);
  }
});

app.post('/api/reviews', async (req, res, next) => {
  try {
    const { source, branch, text } = req.body || {};
    const cleanText = typeof text === 'string' ? text.trim() : '';
    if (!cleanText || cleanText.length > 1200) {
      return res.status(400).json({ message: 'Текст отзыва должен содержать от 1 до 1200 символов.' });
    }
    if (!['Яндекс Карты', '2ГИС', 'Приложение', 'Соцсети'].includes(source)) {
      return res.status(400).json({ message: 'Выберите источник отзыва.' });
    }
    if (typeof branch !== 'string' || !branch.trim() || branch.trim().length > 100) {
      return res.status(400).json({ message: 'Укажите пиццерию.' });
    }

    const reviews = await getReviews();
    const analysis = classifyReview(cleanText);
    const review = {
      id: reviews.reduce((max, item) => Math.max(max, item.id), 100) + 1,
      date: new Date().toISOString().slice(0, 10),
      source,
      branch: branch.trim(),
      text: cleanText,
      ...analysis,
      status: analysis.confidence < 70 ? 'manual' : 'new',
    };
    reviews.unshift(review);
    await saveReviews(reviews);
    res.status(201).json({ review });
  } catch (error) {
    next(error);
  }
});

app.patch('/api/reviews/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body || {};
    if (!Number.isInteger(id) || !['new', 'manual', 'done'].includes(status)) {
      return res.status(400).json({ message: 'Некорректный запрос.' });
    }
    const reviews = await getReviews();
    const index = reviews.findIndex((item) => item.id === id);
    if (index === -1) return res.status(404).json({ message: 'Отзыв не найден.' });
    reviews[index] = { ...reviews[index], status };
    await saveReviews(reviews);
    res.json({ review: reviews[index] });
  } catch (error) {
    next(error);
  }
});

app.post('/api/reset', async (_req, res, next) => {
  try {
    const reviews = await resetReviews();
    res.json({ reviews });
  } catch (error) {
    next(error);
  }
});

app.use('/api', (_req, res) => res.status(404).json({ message: 'Метод API не найден.' }));

// В production Express отдаёт собранный React-клиент из папки dist.
app.use(express.static(distDir));
app.get('*', (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'), (error) => {
    if (error) res.status(503).send('Сначала соберите клиент командой npm run build.');
  });
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Не удалось выполнить запрос. Попробуйте ещё раз.' });
});

await ensureStore();
app.listen(PORT, () => {
  console.log(`Dodo Pulse API запущен: http://localhost:${PORT}`);
});
