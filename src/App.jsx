import { useCallback, useEffect, useMemo, useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Topbar from './components/Topbar.jsx';
import AddReviewModal from './components/AddReviewModal.jsx';
import Icon from './components/Icon.jsx';
import OverviewPage from './pages/OverviewPage.jsx';
import ReviewsPage from './pages/ReviewsPage.jsx';
import TopicsPage from './pages/TopicsPage.jsx';
import { api } from './services/api.js';

const pageTitles = {
  overview: 'Обзор',
  reviews: 'Все отзывы',
  topics: 'Проблемные темы',
  manual: 'На проверке',
};

function calculateStats(reviews) {
  const categories = new Map();
  reviews.forEach((review) => categories.set(review.category, (categories.get(review.category) || 0) + 1));
  const repeated = [...categories.values()].filter((count) => count > 1).length;
  return {
    total: reviews.length,
    attention: reviews.filter((review) => review.status !== 'done' && (review.critical || review.sentiment === 'negative')).length,
    repeated,
    manual: reviews.filter((review) => review.status === 'manual').length,
  };
}

function calculateTopics(reviews) {
  const grouped = new Map();
  reviews.forEach((review) => {
    const item = grouped.get(review.category) || { name: review.category, count: 0, negative: 0 };
    item.count += 1;
    if (review.sentiment === 'negative') item.negative += 1;
    grouped.set(review.category, item);
  });
  return [...grouped.values()].filter((item) => item.negative > 0).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'ru'));
}

function calculateSentiment(reviews) {
  const total = reviews.length || 1;
  const count = {
    negative: reviews.filter((item) => item.sentiment === 'negative').length,
    neutral: reviews.filter((item) => item.sentiment === 'neutral').length,
    positive: reviews.filter((item) => item.sentiment === 'positive').length,
  };
  return {
    negative: Math.round((count.negative / total) * 100),
    neutral: Math.round((count.neutral / total) * 100),
    positive: Math.round((count.positive / total) * 100),
  };
}

function exportReviews(reviews) {
  const fields = ['id', 'date', 'source', 'branch', 'text', 'category', 'sentiment', 'confidence', 'status'];
  const rows = [fields, ...reviews.map((review) => fields.map((field) => review[field] ?? ''))];
  const csv = `\uFEFF${rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(';')).join('\r\n')}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'dodo-pulse-reviews.csv';
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState('overview');
  const [selectedId, setSelectedId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [toast, setToast] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  const showToast = useCallback((message) => {
    setToast(message);
    window.clearTimeout(showToast.timeoutId);
    showToast.timeoutId = window.setTimeout(() => setToast(''), 2800);
  }, []);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const result = await api.getReviews();
      setReviews(result);
      setSelectedId((current) => current ?? result[0]?.id ?? null);
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadReviews(); }, [loadReviews]);

  const stats = useMemo(() => calculateStats(reviews), [reviews]);
  const topics = useMemo(() => calculateTopics(reviews), [reviews]);
  const sentiment = useMemo(() => calculateSentiment(reviews), [reviews]);
  const selectedReview = reviews.find((review) => review.id === selectedId) || null;

  async function handleStatusChange(id, status) {
    try {
      const updated = await api.updateStatus(id, status);
      setReviews((current) => current.map((review) => review.id === id ? updated : review));
      showToast(status === 'manual' ? 'Отзыв отправлен на проверку.' : status === 'done' ? 'Отзыв отмечен как обработанный.' : 'Отзыв возвращён в новые.');
    } catch (error) {
      showToast(error.message);
    }
  }

  async function handleAddReview(payload) {
    setSaving(true);
    try {
      const review = await api.addReview(payload);
      setReviews((current) => [review, ...current]);
      setSelectedId(review.id);
      setPage('reviews');
      setSelectedCategory('Все');
      showToast('Отзыв добавлен. Категория определена предварительно.');
    } finally {
      setSaving(false);
    }
  }

  function openCategory(category) {
    setSelectedCategory(category);
    setPage('reviews');
  }

  const pageContent = () => {
    if (loading) {
      return <div className="page-state"><div className="loader" /><strong>Загружаем отзывы</strong><span>Получаем данные рабочего пространства</span></div>;
    }
    if (loadError) {
      return (
        <div className="page-state error-state">
          <div className="state-icon"><Icon name="alert" size={24} /></div>
          <strong>Не удалось загрузить отзывы</strong>
          <span>{loadError}</span>
          <button className="button button-primary" onClick={loadReviews}><Icon name="refresh" size={16} /> Повторить</button>
        </div>
      );
    }
    if (page === 'overview') {
      return <OverviewPage reviews={reviews} stats={stats} topics={topics} sentiment={sentiment} onOpenReviews={() => setPage('reviews')} onSelectReview={(id) => { setSelectedId(id); setPage('reviews'); }} />;
    }
    if (page === 'topics') {
      return <TopicsPage reviews={reviews} topics={topics} onShowReviews={openCategory} />;
    }
    return (
      <ReviewsPage
        key={`${page}-${selectedCategory}`}
        reviews={reviews}
        selectedReview={selectedReview}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onStatusChange={handleStatusChange}
        initialStatus={page === 'manual' ? 'manual' : 'Все'}
        initialCategory={selectedCategory}
        onExport={() => exportReviews(reviews)}
      />
    );
  };

  return (
    <div className="app-shell">
      <Sidebar page={page} onNavigate={(next) => { setPage(next); setSelectedCategory('Все'); }} manualCount={stats.manual} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="app-main">
        <Topbar onMenu={() => setMobileOpen(true)} onAdd={() => setModalOpen(true)} />
        <main className="main-content">
          {pageContent()}
          {!loading && !loadError && <footer className="app-footer"><span>Dodo Pulse</span><span>Отзывы гостей и повторяющиеся темы</span><span>Тестовый набор; внешние источники пока не подключены</span></footer>}
        </main>
      </div>
      <AddReviewModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleAddReview} busy={saving} />
      {toast && <div className="toast-message"><span className="toast-check"><Icon name="check" size={15} /></span>{toast}</div>}
    </div>
  );
}
