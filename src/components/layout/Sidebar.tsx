import { useStore } from '../../hooks/useStore';
import type { ViewType } from '../../types';

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { key: 'ranking', label: 'Ranking de Obras', icon: 'list' },
  { key: 'simulador', label: 'Simulador', icon: 'sliders' },
] as const;

const decisionItems = [
  { key: 'asistente', label: 'Asistente IA', icon: 'chat' },
  { key: 'reportes', label: 'Reportes', icon: 'file' },
] as const;

const icons: Record<string, React.ReactNode> = {
  grid: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  ),
  list: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <path d="M4 7h16M4 12h11M4 17h7"/>
    </svg>
  ),
  sliders: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <path d="M4 6h16M4 12h16M4 18h16"/>
      <circle cx="9" cy="6" r="2.3" fill="#fbfcfb"/>
      <circle cx="15" cy="12" r="2.3" fill="#fbfcfb"/>
      <circle cx="8" cy="18" r="2.3" fill="#fbfcfb"/>
    </svg>
  ),
  chat: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a8 8 0 0 1-11.3 7.3L4 21l1.7-5.7A8 8 0 1 1 21 12Z"/>
    </svg>
  ),
  file: (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 3v5h5"/>
      <path d="M7 3h7l5 5v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/>
    </svg>
  ),
  upload: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 16V4m0 0 4 4m-4-4-4 4"/>
      <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>
    </svg>
  ),
};

export function Sidebar() {
  const { view, setView, setUploadStep, setCalcProgress } = useStore();
  const activeKey = view === 'detalle' ? 'ranking' : view;

  const handleUpload = () => {
    setView('upload');
    setUploadStep(0);
    setCalcProgress(0);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3c4 4 6 7 6 10a6 6 0 0 1-12 0c0-3 2-6 6-10Z"/>
            <path d="M12 21V9"/>
          </svg>
        </div>
        <div className="logo-text">
          <div className="logo-title">Sustainability<br/>Intelligence</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Análisis</div>
        {navItems.map(item => (
          <button
            key={item.key}
            className={`nav-item ${activeKey === item.key ? 'active' : ''}`}
            onClick={() => setView(item.key as ViewType)}
          >
            {icons[item.icon]}
            {item.label}
          </button>
        ))}

        <div className="nav-section-label" style={{ paddingTop: '12px' }}>Decisión</div>
        {decisionItems.map(item => (
          <button
            key={item.key}
            className={`nav-item ${activeKey === item.key ? 'active' : ''}`}
            onClick={() => setView(item.key as ViewType)}
          >
            {icons[item.icon]}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="upload-btn" onClick={handleUpload}>
          {icons.upload}
          Cargar datos
        </button>
        <div className="user-card">
          <div className="user-avatar">MR</div>
          <div className="user-info">
            <div className="user-name">M. Rivas</div>
            <div className="user-role">Gerencia Sostenibilidad</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
