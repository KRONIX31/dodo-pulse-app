import StatCard from '../components/StatCard.jsx';
import ReviewCard from '../components/ReviewCard.jsx';

export default function OverviewPage({ reviews, stats, topics, sentiment, onOpenReviews, onSelectReview }) {
  const recent = [...reviews].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id).slice(0, 5);
  const maxTopic = Math.max(1, ...topics.map((item) => item.count));

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">Сводка за период</div>
          <h1>Обзор отзывов</h1>
          <p>Что пишут гости и на что стоит обратить внимание.</p>
        </div>
        <button className="button button-secondary" onClick={onOpenReviews}>Все отзывы <span aria-hidden="true">→</span></button>
      </div>

      <div className="stats-grid">
        <StatCard label="Всего отзывов" value={stats.total} note="В текущем наборе" icon="inbox" />
        <StatCard label="Нужна реакция" value={stats.attention} note="Негативные и важные обращения" icon="alert" tone="orange" />
        <StatCard label="Повторяющиеся темы" value={stats.repeated} note="Встречаются больше одного раза" icon="layers" tone="blue" />
        <StatCard label="На проверке" value={stats.manual} note="Ожидают решения управляющего" icon="clock" tone="purple" />
      </div>

      <div className="overview-grid">
        <section className="surface-card topics-card">
          <div className="section-heading">
            <div><h2>О чём чаще пишут</h2><p>Количество отзывов по темам</p></div>
            <span className="subtle-pill">Топ тем</span>
          </div>
          {topics.length === 0 ? <div className="empty-state">Пока нет отзывов для анализа.</div> : (
            <div className="topic-bars">
              {topics.slice(0, 6).map((topic) => (
                <div className="topic-bar-row" key={topic.name}>
                  <span className="topic-bar-name">{topic.name}</span>
                  <div className="topic-bar-track"><span style={{ width: `${(topic.count / maxTopic) * 100}%` }} /></div>
                  <b>{topic.count}</b>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="surface-card sentiment-card">
          <div className="section-heading">
            <div><h2>Тональность</h2><p>Распределение отзывов</p></div>
          </div>
          <div className="sentiment-content">
            <div
              className="sentiment-donut"
              style={{ '--negative': `${sentiment.negative}%`, '--neutral': `${sentiment.neutral}%` }}
            >
              <div><strong>{stats.total}</strong><span>отзывов</span></div>
            </div>
            <div className="sentiment-legend">
              <div><span><i className="legend-dot negative-dot" />Негативные</span><b>{sentiment.negative}%</b></div>
              <div><span><i className="legend-dot neutral-dot" />Нейтральные</span><b>{sentiment.neutral}%</b></div>
              <div><span><i className="legend-dot positive-dot" />Позитивные</span><b>{sentiment.positive}%</b></div>
            </div>
          </div>
        </section>
      </div>

      <section className="recent-section">
        <div className="section-heading recent-heading">
          <div><h2>Последние отзывы</h2><p>Новые обращения из разных источников</p></div>
          <button className="text-button" onClick={onOpenReviews}>Открыть ленту <span>→</span></button>
        </div>
        <div className="recent-list">
          {recent.map((review) => (
            <ReviewCard key={review.id} review={review} compact onClick={() => onSelectReview(review.id)} />
          ))}
          {recent.length === 0 && <div className="empty-state">Отзывы появятся здесь после загрузки.</div>}
        </div>
      </section>
    </>
  );
}
