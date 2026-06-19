import { OBRAS, SCORE_KEYS, SCORE_LABELS } from '../../data/obras';
import { useStore } from '../../hooks/useStore';
import { scoreColor, clusterMeta } from '../../utils/colors';

export function ObraDetalle() {
  const { selectedObra, setView } = useStore();
  const sel = OBRAS.find(o => o.obra === selectedObra) || OBRAS[0];
  const cm = clusterMeta(sel.cluster);

  // Radar chart calculations
  const cx = 150, cy = 148, R = 104;
  const ang = (i: number) => ((-90 + i * 60) * Math.PI) / 180;
  const ptStr = (_r: number, fn: (k: string) => number) =>
    SCORE_KEYS.map((k, i) => {
      const rr = fn(k);
      const x = cx + rr * Math.cos(ang(i));
      const y = cy + rr * Math.sin(ang(i));
      return `${Math.round(x)},${Math.round(y)}`;
    }).join(' ');

  const radarHex = ptStr(R, () => R);
  const radarMid = ptStr(R * 0.66, () => R * 0.66);
  const radarMid2 = ptStr(R * 0.33, () => R * 0.33);
  const radarData = ptStr(R, k => R * (sel.scores[k as keyof typeof sel.scores] / 100));
  const radarSpokes = SCORE_KEYS.map((_, i) => ({
    x2: Math.round(cx + R * Math.cos(ang(i))),
    y2: Math.round(cy + R * Math.sin(ang(i)))
  }));
  const radarAxes = SCORE_KEYS.map((k, i) => {
    const r = R + 20;
    const x = cx + r * Math.cos(ang(i));
    const y = cy + r * Math.sin(ang(i));
    const c = Math.cos(ang(i));
    return {
      label: SCORE_LABELS[k],
      x: Math.round(x),
      y: Math.round(y),
      anchor: (Math.abs(c) < 0.35 ? 'middle' : c > 0 ? 'start' : 'end') as 'middle' | 'start' | 'end'
    };
  });

  // Gauges
  const gauges = SCORE_KEYS.map(k => {
    const v = sel.scores[k];
    return {
      label: SCORE_LABELS[k],
      score: v,
      color: scoreColor(v),
      ring: `conic-gradient(${scoreColor(v)} ${v * 3.6}deg, #ecefed 0deg)`
    };
  });

  // Dimensions
  const dimList = [
    { label: 'Recursos', value: sel.dimensiones.recursos, hint: 'Agua + Energía' },
    { label: 'Residuos', value: sel.dimensiones.residuos, hint: 'Escombros + Tierra' },
    { label: 'Economía Circular', value: sel.dimensiones.economiaCircular, hint: 'Reciclaje + Metalcon' }
  ];

  // Program average
  const progObras = OBRAS.filter(o => o.programa === sel.programa);
  const progAvg = (key: keyof typeof sel.scores) =>
    Math.round(progObras.reduce((s, o) => s + o.scores[key], 0) / progObras.length);
  const progAvgIdx = Math.round(progObras.reduce((s, o) => s + o.indice, 0) / progObras.length);

  const compareRows = SCORE_KEYS.map(k => {
    const obra = sel.scores[k];
    const avg = progAvg(k);
    const diff = obra - avg;
    return {
      label: SCORE_LABELS[k],
      obra,
      avg,
      diff: (diff >= 0 ? '+' : '') + diff,
      color: scoreColor(obra)
    };
  });

  const selDash = (sel.indice / 100 * 339.29).toFixed(1) + ' 339.29';

  return (
    <div className="detalle-view">
      <button className="back-btn" onClick={() => setView('ranking')}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Volver al ranking
      </button>

      {/* Hero */}
      <div className="card hero-card">
        <div className="hero-left">
          <div className="hero-tags">
            <span className="tag-programa">{sel.programa}</span>
            <span className="tag-cluster" style={{ color: cm.color, background: cm.tint }}>{sel.cluster}</span>
            <span className="tag-estado">{sel.estado}</span>
          </div>
          <h2 className="hero-title">{sel.obra}</h2>
          {sel.estado === 'EN EJECUCIÓN' && (
            <div className="prelim-warning">
              <span>⚠</span> Índice preliminar · sujeto a cambios por avance de obra
            </div>
          )}
        </div>
        <div className="hero-gauge">
          <svg width="128" height="128" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="54" fill="none" stroke="#eef1ee" strokeWidth="11" />
            <circle
              cx="64" cy="64" r="54"
              fill="none"
              stroke={scoreColor(sel.indice)}
              strokeWidth="11"
              strokeLinecap="round"
              strokeDasharray={selDash}
              transform="rotate(-90 64 64)"
            />
          </svg>
          <div className="gauge-center">
            <span className="mono gauge-value" style={{ color: scoreColor(sel.indice) }}>{sel.indice}</span>
            <span className="gauge-label">ÍNDICE / 100</span>
          </div>
        </div>
      </div>

      {/* Dimensions */}
      <div className="dim-grid">
        {dimList.map((d, i) => (
          <div key={i} className="card dim-card">
            <div className="dim-header">
              <div>
                <div className="dim-label">{d.label}</div>
                <div className="dim-hint">{d.hint}</div>
              </div>
              <span className="mono dim-value" style={{ color: scoreColor(d.value) }}>{d.value}</span>
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${d.value}%`, background: scoreColor(d.value) }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Radar + Gauges */}
      <div className="radar-gauges-row">
        <div className="card">
          <div className="card-title">Perfil de indicadores</div>
          <div className="card-subtitle">Scores 0–100 por indicador</div>
          <svg viewBox="0 0 300 300" className="radar-svg">
            <polygon points={radarHex} fill="none" stroke="#eef1ee" strokeWidth="1" />
            <polygon points={radarMid} fill="none" stroke="#f1f4f1" strokeWidth="1" />
            <polygon points={radarMid2} fill="none" stroke="#f1f4f1" strokeWidth="1" />
            {radarSpokes.map((s, i) => (
              <line key={i} x1="150" y1="148" x2={s.x2} y2={s.y2} stroke="#f1f4f1" strokeWidth="1" />
            ))}
            <polygon points={radarData} fill="var(--ac)" fillOpacity="0.16" stroke="var(--ac)" strokeWidth="2.2" strokeLinejoin="round" />
            {radarAxes.map((a, i) => (
              <text key={i} x={a.x} y={a.y} textAnchor={a.anchor} dy="4" fontSize="11" fontWeight="600" fill="#4a5853">{a.label}</text>
            ))}
          </svg>
        </div>

        <div className="card">
          <div className="card-title">Scores por indicador</div>
          <div className="card-subtitle" style={{ marginBottom: '18px' }}>Agua, Energía, Escombros, Tierra, Reciclaje, Metalcon</div>
          <div className="gauges-grid">
            {gauges.map((g, i) => (
              <div key={i} className="gauge-item">
                <div className="gauge-ring" style={{ background: g.ring }}>
                  <div className="gauge-inner">
                    <span className="mono gauge-score" style={{ color: g.color }}>{g.score}</span>
                  </div>
                </div>
                <span className="gauge-name">{g.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compare + Insights */}
      <div className="compare-insights-row">
        <div className="card">
          <div className="compare-header">
            <div className="card-title">Comparación vs. promedio del programa</div>
            <div className="compare-avg">Prog. {sel.programa} · prom. <span className="mono">{progAvgIdx}</span></div>
          </div>
          <div className="compare-legend">
            <span className="legend-obra"><span className="legend-bar-obra"></span>Esta obra</span>
            <span className="legend-avg"><span className="legend-bar-avg"></span>Promedio programa</span>
          </div>
          <div className="compare-rows">
            {compareRows.map((c, i) => (
              <div key={i} className="compare-row">
                <span className="compare-label">{c.label}</span>
                <div className="compare-track">
                  <div className="compare-bar" style={{ width: `${c.obra}%`, background: c.color }}></div>
                </div>
                <span className="mono compare-value" style={{ color: c.color }}>{c.obra}</span>
                <span className="mono compare-diff">{c.diff}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="insights-header">
            <div className="insights-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ac)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2v.3h6v-.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2Z"/>
              </svg>
            </div>
            <div className="card-title">Insights del modelo</div>
          </div>
          <div className="insights-list">
            {sel.insights.map((text, i) => (
              <div key={i} className="insight-item">
                <div className="insight-num">{i + 1}</div>
                <div className="insight-text">{text}</div>
              </div>
            ))}
          </div>
          <button className="btn-assistant" onClick={() => useStore.getState().setView('asistente')}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a8 8 0 0 1-11.3 7.3L4 21l1.7-5.7A8 8 0 1 1 21 12Z"/>
            </svg>
            Preguntar al Asistente IA
          </button>
        </div>
      </div>
    </div>
  );
}
