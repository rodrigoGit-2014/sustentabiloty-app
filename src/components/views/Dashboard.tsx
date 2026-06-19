import { OBRAS, EVOL } from '../../data/obras';
import { useStore } from '../../hooks/useStore';
import { scoreColor, clusterMeta } from '../../utils/colors';

export function Dashboard() {
  const { openObra } = useStore();
  const obras = OBRAS;

  // KPIs
  const fin = obras.filter(o => o.estado === 'FINALIZADA');
  const eje = obras.filter(o => o.estado === 'EN EJECUCIÓN');
  const avgIdx = Math.round(obras.reduce((a, o) => a + o.indice, 0) / obras.length);

  const kpis = [
    { label: 'Obras analizadas', value: obras.length, sub: 'Total en plataforma' },
    { label: 'Finalizadas', value: fin.length, sub: 'Ranking oficial' },
    { label: 'En ejecución', value: eje.length, sub: 'Monitoreo activo' },
    { label: 'Índice promedio', value: avgIdx, sub: 'Portafolio · sobre 100' }
  ];

  // Evolution chart
  const ev = EVOL;
  const W = 560, H = 204, pl = 34, pr = 18, pt = 22, pb = 34;
  const ymin = 58, ymax = 82;
  const xs = (i: number) => pl + (W - pl - pr) * (i / (ev.values.length - 1));
  const ys = (v: number) => pt + (H - pt - pb) * (1 - (v - ymin) / (ymax - ymin));
  const evolDots = ev.values.map((v, i) => ({ x: Math.round(xs(i)), y: Math.round(ys(v)), label: ev.labels[i] }));
  const evolLine = evolDots.map(p => `${p.x},${p.y}`).join(' ');
  const evolArea = `M ${evolDots.map(p => `${p.x} ${p.y}`).join(' L ')} L ${Math.round(xs(ev.values.length - 1))} ${H - pb} L ${Math.round(xs(0))} ${H - pb} Z`;
  const evolGrid = [60, 70, 80].map(g => ({ y: Math.round(ys(g)), label: g }));
  const evolDelta = ev.values[ev.values.length - 1] - ev.values[0];

  // Program bars
  const progs = ['DS49', 'DS19', 'DS01', 'INM'] as const;
  const programaBars = progs.map(p => {
    const list = obras.filter(o => o.programa === p);
    const avg = list.length ? Math.round(list.reduce((a, o) => a + o.indice, 0) / list.length) : 0;
    return {
      prog: p,
      count: list.length,
      w: list.length ? avg : 2,
      color: list.length ? scoreColor(avg) : '#d6dad7',
      label: list.length ? avg : '—'
    };
  });

  // Clusters
  const clusterDefs = ['Líderes Ambientales', 'Prometedor', 'Desempeño Intermedio', 'En Riesgo'];
  const clusterLegend = clusterDefs.map(c => ({
    name: c,
    count: obras.filter(o => o.cluster === c).length,
    color: clusterMeta(c).color
  }));

  // Top/Bottom
  const byDesc = [...obras].sort((a, b) => b.indice - a.indice);
  const topRows = byDesc.slice(0, 5);
  const bottomRows = [...obras].sort((a, b) => a.indice - b.indice).slice(0, 5);

  return (
    <div className="dashboard">
      {/* KPIs */}
      <div className="kpi-grid">
        {kpis.map((k, i) => (
          <div key={i} className="card kpi-card">
            <div className="kpi-label">{k.label}</div>
            <div className="kpi-value mono">{k.value}</div>
            <div className="kpi-sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Evolution + Program */}
      <div className="row-2">
        <div className="card evolution-card">
          <div className="card-header">
            <div>
              <div className="card-title">Evolución del índice promedio</div>
              <div className="card-subtitle">Portafolio · últimos 12 meses</div>
            </div>
            <span className="badge-accent mono">{evolDelta >= 0 ? '+' : ''}{evolDelta} pts</span>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} className="chart-svg">
            {evolGrid.map((g, i) => (
              <g key={i}>
                <line x1={pl} y1={g.y} x2={W - pr} y2={g.y} stroke="#eef1ee" strokeWidth="1" />
                <text x="8" y={g.y} dy="4" fontSize="10" fill="#aab3ae" fontFamily="IBM Plex Mono">{g.label}</text>
              </g>
            ))}
            <path d={evolArea} fill="var(--act)" opacity="0.55" />
            <polyline points={evolLine} fill="none" stroke="var(--ac)" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
            {evolDots.map((d, i) => (
              <g key={i}>
                <circle cx={d.x} cy={d.y} r="2.6" fill="#fff" stroke="var(--ac)" strokeWidth="1.8" />
                <text x={d.x} y="194" textAnchor="middle" fontSize="9.5" fill="#9aa49f" fontFamily="IBM Plex Mono">{d.label}</text>
              </g>
            ))}
          </svg>
        </div>

        <div className="card">
          <div className="card-title">Índice por programa</div>
          <div className="card-subtitle" style={{ marginBottom: '16px' }}>Promedio · n° de obras</div>
          <div className="programa-bars">
            {programaBars.map((b, i) => (
              <div key={i} className="programa-bar">
                <div className="programa-bar-header">
                  <span className="programa-name">{b.prog} <span className="programa-count">· {b.count} obras</span></span>
                  <span className="mono programa-value">{b.label}</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${b.w}%`, background: b.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clusters + Top + Bottom */}
      <div className="row-3">
        <div className="card">
          <div className="card-title" style={{ marginBottom: '16px' }}>Distribución por cluster</div>
          <div className="cluster-content">
            <div className="donut">
              <div className="donut-center">
                <span className="mono donut-num">4</span>
                <span className="donut-label">clusters</span>
              </div>
            </div>
            <div className="cluster-legend">
              {clusterLegend.map((c, i) => (
                <div key={i} className="legend-item">
                  <span className="legend-dot" style={{ background: c.color }}></span>
                  <span className="legend-name">{c.name}</span>
                  <span className="mono legend-count">{c.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title-icon">
            <span style={{ color: '#0f766e' }}>▲</span>
            <span className="card-title">Top 5 obras</span>
          </div>
          <div className="ranking-rows">
            {topRows.map((r, i) => (
              <div key={i} className="ranking-row" onClick={() => openObra(r.obra)}>
                <span className="rank-num mono">{i + 1}</span>
                <div className="rank-content">
                  <div className="rank-header">
                    <span className="rank-name">{r.obra}</span>
                    <span className="mono rank-value">{r.indice}</span>
                  </div>
                  <div className="mini-bar-track">
                    <div className="mini-bar-fill" style={{ width: `${r.indice}%`, background: scoreColor(r.indice) }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-title-icon">
            <span style={{ color: '#c0512f' }}>▼</span>
            <span className="card-title">Bottom 5 obras</span>
          </div>
          <div className="ranking-rows">
            {bottomRows.map((r, i) => (
              <div key={i} className="ranking-row" onClick={() => openObra(r.obra)}>
                <span className="rank-num mono">{i + 1}</span>
                <div className="rank-content">
                  <div className="rank-header">
                    <span className="rank-name">{r.obra}</span>
                    <span className="mono rank-value">{r.indice}</span>
                  </div>
                  <div className="mini-bar-track">
                    <div className="mini-bar-fill" style={{ width: `${r.indice}%`, background: scoreColor(r.indice) }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
