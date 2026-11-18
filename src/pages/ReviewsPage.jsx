import { useMemo, useState } from 'react';
import Icon from '../components/Icon.jsx';
import ReviewCard from '../components/ReviewCard.jsx';
import ReviewDetail from '../components/ReviewDetail.jsx';

const ALL = 'Все';

export default function ReviewsPage({ reviews, selectedId, onSelect, onStatusChange, initialStatus = ALL, initialCategory = ALL, onExport }) {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState(ALL);
  const [branch, setBranch] = useState(ALL);
  const [category, setCategory] = useState(initialCategory);
  const [status, setStatus] = useState(initialStatus);
  const [sentiment, setSentiment] = useState(ALL);
  const [sort, setSort] = useState('newest');

  const sources = useMemo(() => [ALL, ...new Set(reviews.map((item) => item.source).filter(Boolean))], [reviews]);
  const branches = useMemo(() => [ALL, ...new Set(reviews.map((item) => item.branch).filter(Boolean))], [reviews]);
  const categories = useMemo(() => [ALL, ...new Set(reviews.map((item) => item.category).filter(Boolean))], [reviews]);

  const filtered = useMemo(() => reviews.filter((review) => {
    const searchText = `${review.text} ${review.branch} ${review.category} ${review.source}`.toLowerCase();
    if (query.trim() && !searchText.includes(query.trim().toLowerCase())) return false;
    if (source !== ALL && review.source !== source) return false;
    if (branch !== ALL && review.branch !== branch) return false;
    if (category !== ALL && review.category !== category) return false;
    if (status !== ALL && review.status !== status) return false;
    if (sentiment !== ALL && review.sentiment !== sentiment) return false;
    return true;
  }).sort((a, b) => {
    if (sort === 'oldest') return a.date.localeCompare(b.date) || a.id - b.id;
    if (sort === 'confidence-high') return b.confidence - a.confidence || b.id - a.id;
    if (sort === 'confidence-low') return a.confidence - b.confidence || b.id - a.id;
    return b.date.localeCompare(a.date) || b.id - a.id;
  }), [reviews, query, source, branch, category, status, sentiment, sort]);

  const visibleSelectedReview = filtered.find((item) => item.id === selectedId) || filtered[0] || null;

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">Обратная связь гостей</div>
          <h1>{initialStatus === 'manual' ? 'На проверке' : 'Все отзывы'}</h1>
          <p>Найдите нужное обращение и посмотрите, что за ним стоит.</p>
        </div>
        <button className="button button-secondary" onClick={onExport}><Icon name="download" size={16} /> Выгрузить CSV</button>
      </div>

      <div className="filter-panel">
        <label className="search-field">
          <Icon name="search" size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по тексту, теме или пиццерии" />
          {query && <button className="clear-search" onClick={() => setQuery('')} aria-label="Очистить поиск">×</button>}
        </label>
        <select value={source} onChange={(event) => setSource(event.target.value)} aria-label="Источник">
          {sources.map((item) => <option key={item} value={item}>{item === ALL ? 'Все источники' : item}</option>)}
        </select>
        <select value={branch} onChange={(event) => setBranch(event.target.value)} aria-label="Пиццерия">
          {branches.map((item) => <option key={item} value={item}>{item === ALL ? 'Все пиццерии' : item}</option>)}
        </select>
        <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Тема">
          {categories.map((item) => <option key={item} value={item}>{item === ALL ? 'Все темы' : item}</option>)}
        </select>
        <select value={sentiment} onChange={(event) => setSentiment(event.target.value)} aria-label="Тональность">
          <option value={ALL}>Любая тональность</option>
          <option value="positive">Положительные</option>
          <option value="neutral">Нейтральные</option>
          <option value="negative">Отрицательные</option>
        </select>
      </div>

      <div className="list-toolbar">
        <div className="filter-tabs" role="tablist" aria-label="Статус отзывов">
          {[ALL, 'new', 'manual', 'done'].map((item) => {
            const label = item === ALL ? 'Все' : item === 'new' ? 'Новые' : item === 'manual' ? 'На проверке' : 'Обработанные';
            return <button key={item} className={status === item ? 'filter-tab active' : 'filter-tab'} onClick={() => setStatus(item)}>{label}</button>;
          })}
        </div>
        <div className="list-controls">
          <label className="sort-control">Сортировка
            <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Сортировка отзывов">
              <option value="newest">Сначала новые</option>
              <option value="oldest">Сначала старые</option>
              <option value="confidence-high">Сначала высокая уверенность</option>
              <option value="confidence-low">Сначала низкая уверенность</option>
            </select>
          </label>
          <span className="result-count">Найдено: <strong>{filtered.length}</strong></span>
        </div>
      </div>

      <div className="reviews-layout">
        <div className="reviews-list">
          {filtered.map((review) => (
            <ReviewCard key={review.id} review={review} selected={visibleSelectedReview?.id === review.id} onClick={() => onSelect(review.id)} />
          ))}
          {filtered.length === 0 && <div className="empty-state empty-large"><Icon name="search" size={24} /><strong>Ничего не найдено</strong><span>Попробуйте изменить запрос или фильтры.</span></div>}
        </div>
        <ReviewDetail review={visibleSelectedReview} onStatusChange={onStatusChange} />
      </div>
    </>
  );
}
