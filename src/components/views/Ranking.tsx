import { OBRAS } from '../../data/obras';
import { useStore } from '../../hooks/useStore';
import { scoreColor, clusterMeta } from '../../utils/colors';
import type { Obra } from '../../types';

export function Ranking() {
  const { query, programFilter, sortField, sortDir, setQuery, setProgramFilter, toggleSort, openObra } = useStore();

  const obras = OBRAS;
  const fin = obras.filter(o => o.estado === 'FINALIZADA');
  const eje = obras.filter(o => o.estado === 'EN EJECUCIÓN');

  // Filters
  const matchF = (o: Obra) =>
    (programFilter === 'Todos' || o.programa === programFilter) &&
    (!query || o.obra.toLowerCase().includes(query.toLowerCase()));

  const sortFn = (a: Obra, b: Obra) => {
    let r: number;
    if (sortField === 'obra') {
      r = a.obra.localeCompare(b.obra);
    } else {
      r = a.indice - b.indice;
    }
    return sortDir === 'asc' ? r : -r;
  };

  // Ranking by index
  const finRank: Record<string, number> = {};
  [...fin].sort((a, b) => b.indice - a.indice).forEach((o, i) => {
    finRank[o.obra] = i + 1;
  });

  const officialRows = fin.filter(matchF).sort(sortFn);
  const monitorRows = eje.filter(matchF).sort(sortFn);

  const programChips = ['Todos', 'DS49', 'DS19', 'DS01', 'INM'] as const;

  return (
    <div className="ranking-view">
      {/* Controls */}
      <div className="ranking-controls">
        <div className="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9aa49f" strokeWidth="2">
            <circle cx="11" cy="11" r="7"/>
            <path d="m20 20-3.5-3.5" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar obra…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div className="program-chips">
          {programChips.map(p => (
            <button
              key={p}
              className={`chip ${programFilter === p ? 'active' : ''}`}
              onClick={() => setProgramFilter(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Official Ranking */}
      <div className="card ranking-table">
        <div className="table-header">
          <div className="dot-accent"></div>
          <span className="table-title">Ranking Oficial</span>
          <span className="table-hint">· Solo obras FINALIZADAS</span>
        </div>
        <div className="table-columns">
          <div className="col-rank">#</div>
          <div className="col-obra sortable" onClick={() => toggleSort('obra')}>Obra</div>
          <div className="col-programa">Programa</div>
          <div className="col-cluster">Cluster</div>
          <div className="col-indice sortable" onClick={() => toggleSort('indice')}>
            Índice {sortDir === 'desc' ? '▾' : '▴'}
          </div>
          <div className="col-action">Acción</div>
        </div>
        {officialRows.map((r, i) => {
          const cm = clusterMeta(r.cluster);
          return (
            <div key={i} className="table-row" onClick={() => openObra(r.obra)}>
              <div className="col-rank mono">{finRank[r.obra]}</div>
              <div className="col-obra">{r.obra}</div>
              <div className="col-programa">
                <span className="tag-programa">{r.programa}</span>
              </div>
              <div className="col-cluster">
                <span className="tag-cluster" style={{ color: cm.color, background: cm.tint }}>{r.cluster}</span>
              </div>
              <div className="col-indice">
                <span className="mono indice-value" style={{ color: scoreColor(r.indice) }}>{r.indice}</span>
                <div className="mini-bar-track">
                  <div className="mini-bar-fill" style={{ width: `${r.indice}%`, background: scoreColor(r.indice) }}></div>
                </div>
              </div>
              <div className="col-action">Ver detalle →</div>
            </div>
          );
        })}
      </div>

      {/* Monitor */}
      <div className="card ranking-table">
        <div className="table-header">
          <div className="dot-amber"></div>
          <span className="table-title">Monitoreo</span>
          <span className="table-hint">· Obras EN EJECUCIÓN</span>
        </div>
        <div className="warning-banner">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#b5852a" strokeWidth="2">
            <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Los índices de obras en ejecución son <strong>preliminares</strong> y pueden cambiar conforme avanza la obra.</span>
        </div>
        {monitorRows.map((r, i) => {
          const cm = clusterMeta(r.cluster);
          return (
            <div key={i} className="table-row" onClick={() => openObra(r.obra)}>
              <div className="col-rank prelim">PRELIM</div>
              <div className="col-obra">{r.obra}</div>
              <div className="col-programa">
                <span className="tag-programa">{r.programa}</span>
              </div>
              <div className="col-cluster">
                <span className="tag-cluster" style={{ color: cm.color, background: cm.tint }}>{r.cluster}</span>
              </div>
              <div className="col-indice">
                <span className="mono indice-value" style={{ color: scoreColor(r.indice) }}>{r.indice}</span>
                <div className="mini-bar-track">
                  <div className="mini-bar-fill" style={{ width: `${r.indice}%`, background: scoreColor(r.indice) }}></div>
                </div>
              </div>
              <div className="col-action">Ver detalle →</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
