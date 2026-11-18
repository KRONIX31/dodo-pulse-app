import { formatDate, getSourceMark, statusLabel } from '../utils/format.js';

export default function ReviewCard({ review, selected, onClick, compact = false }) {
  const sourceClass = ({ 'Яндекс Карты': 'yandex', '2ГИС': 'twogis', Приложение: 'app', Соцсети: 'social' })[review.source] || 'other';
  const sentimentClass = review.sentiment === 'positive' ? 'positive' : review.sentiment === 'negative' ? 'negative' : 'neutral';
  return (
    <button className={`review-card ${selected ? 'selected' : ''} ${compact ? 'compact' : ''}`} onClick={onClick}>
      <div className="review-card-top">
        <div className="review-source-line">
          <span className={`source-mark source-mark-${sourceClass}`}>{getSourceMark(review.source)}</span>
          <span className="review-source">{review.source}</span>
          <span className="meta-separator">·</span>
          <span className="review-branch">{review.branch}</span>
        </div>
        <time className="review-date">{formatDate(review.date)}</time>
      </div>
      <p className="review-text">{review.text}</p>
      <div className="review-card-bottom">
        <div className="tag-row">
          <span className={`tag tag-${sentimentClass}`}>{review.category}</span>
          {review.critical && <span className="tag tag-critical">Важный сигнал</span>}
          {!compact && <span className={`tag tag-status status-${review.status}`}>{statusLabel(review.status)}</span>}
        </div>
        <span className={`confidence ${review.confidence < 70 ? 'confidence-low' : ''}`}>
          {review.confidence}%
        </span>
      </div>
    </button>
  );
}
