import { useStore } from '../../hooks/useStore';
import { OBRAS } from '../../data/obras';

const titles: Record<string, [string, string]> = {
  dashboard: ['Dashboard Ejecutivo', 'Visión consolidada del desempeño ambiental del portafolio'],
  ranking: ['Ranking de Obras', 'Comparativa oficial y monitoreo de obras en ejecución'],
  simulador: ['Simulador de Sensibilidad', 'Ajusta los pesos de cada dimensión y observa el reordenamiento'],
  asistente: ['Asistente IA', 'Explicaciones del modelo orientadas a la acción'],
  reportes: ['Exportación de Reportes', 'Entregables para distintos stakeholders'],
};

export function Header() {
  const { view, selectedObra, setView } = useStore();

  const sel = OBRAS.find(o => o.obra === selectedObra) || OBRAS[0];
  const [title, subtitle] = view === 'detalle'
    ? [sel.obra, 'Detalle de desempeño y explicabilidad del índice']
    : (titles[view] || titles.dashboard);

  const toggleSidebar = useStore(state => state.toggleSidebar);

  return (
    <header className="header">
      <button className="menu-toggle" onClick={toggleSidebar} aria-label="Abrir menú">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
        <div className="header-subtitle">{subtitle}</div>
      </div>
      <div className="header-right">
        <div className="data-pill">
          <span className="live-dot"></span>
          Datos al 30 jun 2026
        </div>
        <button className="export-btn" onClick={() => setView('reportes')}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 15V3m0 12-4-4m4 4 4-4"/>
            <path d="M20 17v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2"/>
          </svg>
          Exportar
        </button>
      </div>
    </header>
  );
}
