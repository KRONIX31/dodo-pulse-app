import Icon from './Icon.jsx';

const items = [
  { id: 'overview', label: 'Обзор', icon: 'grid' },
  { id: 'reviews', label: 'Все отзывы', icon: 'inbox' },
  { id: 'topics', label: 'Проблемные темы', icon: 'layers' },
];

export default function Sidebar({ page, onNavigate, manualCount, mobileOpen, onClose }) {
  return (
    <>
      {mobileOpen && <button className="sidebar-backdrop" aria-label="Закрыть меню" onClick={onClose} />}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">D</div>
          <div className="brand-copy">
            <strong>DODO PULSE</strong>
            <span>ОТЗЫВЫ ГОСТЕЙ</span>
          </div>
        </div>

        <div className="sidebar-section-label">Рабочее пространство</div>
        <nav className="side-nav" aria-label="Основная навигация">
          {items.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${page === item.id ? 'active' : ''}`}
              onClick={() => { onNavigate(item.id); onClose?.(); }}
            >
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
            </button>
          ))}
          <button
            className={`nav-item ${page === 'manual' ? 'active' : ''}`}
            onClick={() => { onNavigate('manual'); onClose?.(); }}
          >
            <Icon name="alert" size={18} />
            <span>На проверке</span>
            {manualCount > 0 && <span className="nav-count">{manualCount}</span>}
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="workspace-card">
            <span className="workspace-dot" />
            <div>
              <strong>Рабочая область</strong>
              <small>Пиццерии Ярославля</small>
            </div>
          </div>
          <div className="sidebar-foot">Dodo Pulse <span>·</span> версия 1.0</div>
        </div>
      </aside>
    </>
  );
}
