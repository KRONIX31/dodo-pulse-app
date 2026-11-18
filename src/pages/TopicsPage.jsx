import { formatDate } from '../utils/format.js';

export default function TopicsPage({ reviews, topics, onShowReviews }) {
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">Повторяющиеся обращения</div>
          <h1>Проблемные темы</h1>
          <p>Какие ситуации повторяются и где они возникают чаще.</p>
        </div>
      </div>

      {topics.length === 0 ? <div className="empty-state empty-large">Пока недостаточно отзывов, чтобы выделить темы.</div> : (
        <div className="topic-cards-grid">
          {topics.map((topic) => {
            const examples = reviews.filter((review) => review.category === topic.name).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 2);
            const branches = [...new Set(reviews.filter((review) => review.category === topic.name).map((review) => review.branch))];
            return (
              <article className="topic-detail-card" key={topic.name}>
                <div className="topic-detail-top"><span className="topic-kicker">ТЕМА</span><strong>{topic.count}</strong></div>
                <h2>{topic.name}</h2>
                <p className="topic-branch-line">{branches.length ? branches.join(' · ') : 'Пиццерия не указана'}</p>
                <div className="topic-examples">
                  {examples.map((review) => (
                    <div className="topic-example" key={review.id}>
                      <p>«{review.text}»</p>
                      <span>{review.branch} <i>·</i> {formatDate(review.date)}</span>
                    </div>
                  ))}
                </div>
                <button className="text-button" onClick={() => onShowReviews(topic.name)}>Все отзывы по теме <span>→</span></button>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
