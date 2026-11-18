import Icon from './Icon.jsx';
import { CATEGORIES } from '../../shared/classify.js';
import { formatDate, getSourceMark, sentimentLabel, statusLabel } from '../utils/format.js';

export default function ReviewDetail({ review, onStatusChange, onCategoryChange, onDelete }) {
  if (!review) {
    return (
      <aside className="detail-panel detail-empty">
        <div className="detail-empty-icon"><Icon name="inbox" size={24} /></div>
        <strong>Выберите отзыв</strong>
        <p>Здесь появится исходный текст, категория и текущий статус.</p>
      </aside>
    );
  }

  const sourceClass = ({ 'Яндекс Карты': 'yandex', '2ГИС': 'twogis', Приложение: 'app', Соцсети: 'social' })[review.source] || 'other';
  const sentiment = review.sentiment === 'positive' ? 'positive' : review.sentiment === 'negative' ? 'negative' : 'neutral';

  return (
    <aside className="detail-panel">
      <div className="detail-heading">
        <div>
          <div className="eyebrow">Карточка отзыва</div>
          <h3>Отзыв №{review.id}</h3>
          <p>{review.source} <span>·</span> {formatDate(review.date, { year: 'numeric' })}</p>
        </div>
        <span className={`tag tag-status status-${review.status}`}>{statusLabel(review.status)}</span>
      </div>

      <div className="detail-original">
        <div className="detail-section-label">Текст отзыва</div>
        <p>«{review.text}»</p>
      </div>

      <div className="detail-facts">
        <div className="detail-fact"><span>Пиццерия</span><strong>{review.branch}</strong></div>
        <div className="detail-fact"><span>Тема</span><strong>{review.category}</strong></div>
        <div className="detail-fact"><span>Тональность</span><strong className={`sentiment-text ${sentiment}`}>{sentimentLabel(review.sentiment)}</strong></div>
      </div>

      <div className="confidence-box">
        <div className="confidence-heading">
          <div><strong>Уверенность классификации</strong><small>Оценка по найденным признакам</small></div>
          <b>{review.confidence}%</b>
        </div>
        <div className="confidence-track"><span style={{ width: `${review.confidence}%` }} /></div>
        <p>{review.reason}</p>
      </div>

      <div className="category-box">
        <div className="category-heading">
          <strong>Категория обращения</strong>
          <small>Если тема определена неверно, выберите её вручную</small>
        </div>
        <select
          className="category-select"
          value={review.category}
          onChange={(event) => onCategoryChange(review.id, event.target.value)}
          aria-label="Категория отзыва"
        >
          {CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        {review.confidence < 70 && (
          <div className="inline-warning">
            <Icon name="alert" size={15} /> Классификатор не уверен в теме — проверьте категорию.
          </div>
        )}
      </div>

      <div className="detail-note">
        <Icon name="info" size={16} />
        <span>Категория помогает быстрее разобрать обращение. Окончательное решение принимает управляющий.</span>
      </div>

      <div className="detail-actions">
        {review.status !== 'manual' && review.status !== 'done' && (
          <button className="button button-secondary full-width" onClick={() => onStatusChange(review.id, 'manual')}>
            <Icon name="alert" size={16} /> Передать на проверку
          </button>
        )}
        {review.status !== 'done' && (
          <button className="button button-primary full-width" onClick={() => onStatusChange(review.id, 'done')}>
            <Icon name="check" size={16} /> Отметить обработанным
          </button>
        )}
        {review.status === 'done' && (
          <button className="button button-secondary full-width" onClick={() => onStatusChange(review.id, 'new')}>
            Вернуть в новые
          </button>
        )}
        {review.status === 'manual' && (
          <div className="detail-status-hint"><Icon name="clock" size={15} /> Ожидает проверки управляющим</div>
        )}
      </div>

      <div className="detail-delete">
        <button className="button button-danger full-width" onClick={() => onDelete(review.id)}>
          <Icon name="close" size={16} /> Удалить отзыв
        </button>
        <span className="delete-hint">Например, если обращение содержит мат или оскорбления</span>
      </div>

      <div className="detail-id"><span className={`source-mark source-mark-${sourceClass}`}>{getSourceMark(review.source)}</span> Источник: {review.source}</div>
    </aside>
  );
}