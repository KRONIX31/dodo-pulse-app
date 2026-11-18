import { useState } from 'react';
import Icon from './Icon.jsx';

const SOURCES = ['Яндекс Карты', '2ГИС', 'Приложение', 'Соцсети'];

export default function AddReviewModal({ open, onClose, onSubmit, busy }) {
  const [source, setSource] = useState(SOURCES[0]);
  const [branch, setBranch] = useState('Ярославль — Центр');
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  async function handleSubmit(event) {
    event.preventDefault();
    if (!text.trim()) {
      setError('Добавьте текст отзыва.');
      return;
    }
    if (text.trim().length > 1200) {
      setError('Текст не должен превышать 1200 символов.');
      return;
    }
    if (!branch.trim()) {
      setError('Укажите пиццерию.');
      return;
    }
    setError('');
    try {
      await onSubmit({ source, branch, text: text.trim() });
      setText('');
      setError('');
      onClose();
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="add-review-title">
        <div className="modal-heading">
          <div><div className="eyebrow">Новое обращение</div><h2 id="add-review-title">Добавить отзыв</h2><p>Заполните источник, пиццерию и текст сообщения.</p></div>
          <button className="icon-button" aria-label="Закрыть" onClick={onClose}><Icon name="close" size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="form-label">Источник
            <select value={source} onChange={(event) => setSource(event.target.value)}>
              {SOURCES.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="form-label">Пиццерия
            <input value={branch} onChange={(event) => setBranch(event.target.value)} placeholder="Например, Ярославль — Центр" maxLength={100} />
          </label>
          <label className="form-label">Текст отзыва
            <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Вставьте текст отзыва..." rows={5} maxLength={1200} />
            <span className="field-hint">{text.length}/1200 символов</span>
          </label>
          {error && <div className="form-error">{error}</div>}
          <div className="modal-actions">
            <button type="button" className="button button-secondary" onClick={onClose}>Отмена</button>
            <button type="submit" className="button button-primary" disabled={busy}>{busy ? 'Сохраняем…' : 'Добавить отзыв'}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
