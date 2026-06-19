import { useEffect, useRef } from 'react';
import { REPORTS } from '../../data/obras';
import { useStore } from '../../hooks/useStore';

export function Reportes() {
  const { report, reportDone, setReport, setReportDone } = useStore();
  const timeoutRef = useRef<number | null>(null);

  const handleGenerate = (id: string) => {
    if (reportDone[id] || report === id) return;
    setReport(id);
    timeoutRef.current = window.setTimeout(() => {
      setReportDone(id);
      setReport(null);
    }, 1500);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="reportes-view">
      <div className="reports-grid">
        {REPORTS.map(r => {
          const done = reportDone[r.id];
          const loading = report === r.id;
          const idle = !done && !loading;

          return (
            <div key={r.id} className="card report-card">
              <div className="report-header">
                <div className="report-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ac)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 3v5h5"/>
                    <path d="M7 3h7l5 5v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/>
                  </svg>
                </div>
                <span className="report-tag mono">{r.tag}</span>
              </div>
              <div className="report-title">{r.title}</div>
              <div className="report-desc">{r.desc}</div>
              <div className="report-footer">
                <span className="report-meta">{r.meta}</span>
                <button
                  className={`report-btn ${done ? 'done' : ''}`}
                  onClick={() => handleGenerate(r.id)}
                >
                  {loading && (
                    <>
                      <span className="btn-spinner"></span> Generando…
                    </>
                  )}
                  {done && (
                    <>
                      <span>✓</span> Generado
                    </>
                  )}
                  {idle && (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 15V3m0 12-4-4m4 4 4-4"/>
                        <path d="M20 17v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2"/>
                      </svg>
                      Generar
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card consolidated-card">
        <div className="consolidated-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--ac)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3c4 4 6 7 6 10a6 6 0 0 1-12 0c0-3 2-6 6-10Z"/>
          </svg>
        </div>
        <div className="consolidated-info">
          <div className="consolidated-title">Reporte consolidado del portafolio</div>
          <div className="consolidated-desc">Índice global, ranking oficial, monitoreo, clusters e insights · 4 obras · datos al 30 jun 2026</div>
        </div>
        <button className="btn-primary">Descargar todo</button>
      </div>
    </div>
  );
}
