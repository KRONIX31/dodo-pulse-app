import Icon from './Icon.jsx';

export default function Topbar({ onMenu, onAdd }) {
  return (
    <header className="topbar">
      <button className="icon-button mobile-menu" aria-label="Открыть меню" onClick={onMenu}>
        <Icon name="menu" size={20} />
      </button>
      <div className="topbar-context">
        <span className="online-dot" />
        <span>Обратная связь гостей</span>
      </div>
      <div className="topbar-actions">
        <button className="button button-primary top-add" onClick={onAdd}>
          <Icon name="plus" size={17} />
          <span>Добавить отзыв</span>
        </button>
        <div className="user-chip">
          <div className="user-avatar">М</div>
          <div className="user-copy"><strong>Менеджер</strong><small>Рабочий аккаунт</small></div>
        </div>
      </div>
    </header>
  );
}
