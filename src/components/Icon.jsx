const paths = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  inbox: <><path d="M4 4h16l1 11h-5l-2 3h-4l-2-3H3L4 4Z"/><path d="M3.5 15H9l2 3h2l2-3h5.5"/></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></>,
  plus: <><path d="M12 5v14M5 12h14"/></>,
  search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></>,
  download: <><path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M4 17v4h16v-4"/></>,
  refresh: <><path d="M20 7v5h-5"/><path d="M4.8 9a7.5 7.5 0 0 1 12.6-3L20 7M4 17v-5h5"/><path d="M19.2 15a7.5 7.5 0 0 1-12.6 3L4 17"/></>,
  arrow: <><path d="M5 12h14m-6-6 6 6-6 6"/></>,
  close: <><path d="m6 6 12 12M18 6 6 18"/></>,
  alert: <><path d="M12 3 2.8 20h18.4L12 3Z"/><path d="M12 9v5m0 3h.01"/></>,
  check: <><path d="m5 12 4 4L19 6"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  store: <><path d="M4 10V6l2-3h12l2 3v4"/><path d="M3 10h18v11H3zM9 21v-6h6v6"/><path d="M3 10c0 2 3 2 3 0 0 2 3 2 3 0 0 2 3 2 3 0 0 2 3 2 3 0 0 2 3 2 3 0"/></>,
  menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/></>,
  chevron: <path d="m9 18 6-6-6-6"/>,
};

export default function Icon({ name, size = 18, strokeWidth = 1.8, className = '' }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name] || paths.info}
    </svg>
  );
}
