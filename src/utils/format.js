export function formatDate(value, options = {}) {
  if (!value) return '—';
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    ...options,
  }).format(date).replace(' г.', '');
}

export function statusLabel(status) {
  return ({ new: 'Новый', manual: 'На проверке', done: 'Обработан' })[status] || 'Новый';
}

export function sentimentLabel(sentiment) {
  return ({ negative: 'Негативный', neutral: 'Нейтральный', positive: 'Позитивный' })[sentiment] || 'Не определён';
}

export function getSourceMark(source) {
  return ({ 'Яндекс Карты': 'Я', '2ГИС': '2', Приложение: 'П', Соцсети: 'С' })[source] || 'О';
}
