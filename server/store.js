import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(here, 'data');
const dataFile = path.join(dataDir, 'reviews.json');
const seedFile = path.join(dataDir, 'seed-reviews.json');

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

export async function ensureStore() {
  await mkdir(dataDir, { recursive: true });
  try {
    await readFile(dataFile, 'utf8');
  } catch {
    const initial = await readJson(seedFile);
    await writeJson(initial);
  }
}

async function writeJson(reviews) {
  const tempFile = `${dataFile}.tmp`;
  await writeFile(tempFile, `${JSON.stringify(reviews, null, 2)}\n`, 'utf8');
  await rename(tempFile, dataFile);
}

export async function getReviews() {
  await ensureStore();
  return readJson(dataFile);
}

export async function saveReviews(reviews) {
  await writeJson(reviews);
}

export async function resetReviews() {
  const seed = await readJson(seedFile);
  await writeJson(seed);
  return seed;
}
