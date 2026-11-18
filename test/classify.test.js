import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyReview } from '../shared/classify.js';

test('распознаёт задержку доставки', () => {
  assert.equal(classifyReview('Курьер задержался на 40 минут').category, 'Доставка');
});

test('выделяет критичный сигнал безопасности', () => {
  const result = classifyReview('В коробке обнаружили кусок пластика');
  assert.equal(result.category, 'Безопасность');
  assert.equal(result.critical, true);
});

test('распознаёт проблему с промокодом', () => {
  assert.equal(classifyReview('Промокод не применился при оплате').category, 'Оплата и промокоды');
});

test('не делает уверенный вывод по незнакомому тексту', () => {
  const result = classifyReview('Заказ был обычным, без особых замечаний');
  assert.equal(result.category, 'Другое');
  assert.ok(result.confidence < 70);
});
