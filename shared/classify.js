const rules = [
  {
    category: 'Безопасность',
    sentiment: 'negative',
    critical: true,
    keywords: ['волос', 'пластик', 'посторонний предмет', 'гряз', 'сырое мясо', 'отрав', 'аллерг'],
    reason: 'В отзыве есть слова, которые могут указывать на проблему с безопасностью или качеством продукта.',
  },
  {
    category: 'Доставка',
    sentiment: 'negative',
    critical: false,
    keywords: ['опоздал', 'задерж', 'ждал', 'ожидан', 'долго вез', 'курьер не', 'часа', 'минут'],
    reason: 'Найдены упоминания времени ожидания или задержки доставки.',
  },
  {
    category: 'Качество заказа',
    sentiment: 'negative',
    critical: false,
    keywords: ['холодн', 'перепутал', 'не долож', 'не тот заказ', 'подгор', 'невкус', 'тесто', 'начинк'],
    reason: 'Текст содержит замечания к составу, температуре или качеству заказа.',
  },
  {
    category: 'Сервис',
    sentiment: 'negative',
    critical: false,
    keywords: ['хам', 'груб', 'персонал', 'кассир', 'оператор', 'не отвеч', 'не извини'],
    reason: 'Найдены слова, связанные с обслуживанием и общением с гостем.',
  },
  {
    category: 'Оплата и промокоды',
    sentiment: 'negative',
    critical: false,
    keywords: ['оплат', 'списал', 'деньги', 'промокод', 'скидк', 'вернул средств', 'чек'],
    reason: 'В отзыве упоминается оплата, возврат или применение скидки.',
  },
  {
    category: 'Похвала',
    sentiment: 'positive',
    critical: false,
    keywords: ['вкусно', 'отличн', 'спасибо', 'любим', 'быстро', 'супер', 'понрав', 'молодцы'],
    reason: 'В тексте есть положительная оценка заказа или обслуживания.',
  },
];

export function classifyReview(text) {
  const normalized = String(text || '').toLowerCase().replaceAll('ё', 'е');
  const matches = rules
    .map((rule) => ({ rule, hits: rule.keywords.filter((word) => normalized.includes(word)) }))
    .filter((item) => item.hits.length > 0)
    .sort((a, b) => b.hits.length - a.hits.length);

  if (!matches.length) {
    return {
      category: 'Другое',
      sentiment: 'neutral',
      confidence: 54,
      critical: false,
      reason: 'Не удалось уверенно определить тему. Рекомендуем прочитать отзыв и выбрать категорию вручную.',
    };
  }

  const { rule, hits } = matches[0];
  let confidence = Math.min(96, 68 + hits.length * 9);
  if (normalized.length < 45) confidence = Math.max(62, confidence - 5);
  if (matches.length > 1 && matches[1].hits.length === hits.length) confidence -= 8;

  return {
    category: rule.category,
    sentiment: rule.sentiment,
    confidence,
    critical: rule.critical,
    reason: rule.reason,
  };
}
