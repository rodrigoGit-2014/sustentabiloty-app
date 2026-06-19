import { OBRAS } from '../../data/obras';
import { useStore } from '../../hooks/useStore';
import { scoreColor } from '../../utils/colors';

export function Simulador() {
  const { wRecursos, wResiduos, wEc, setWeights, resetWeights } = useStore();

  const obras = OBRAS;
  const byDesc = [...obras].sort((a, b) => b.indice - a.indice);
  const baseRank: Record<string, number> = {};
  byDesc.forEach((o, i) => {
    baseRank[o.obra] = i + 1;
  });

  const sumW = (wRecursos + wResiduos + wEc) || 1;
  const pR = Math.round((wRecursos / sumW) * 100);
  const pRes = Math.round((wResiduos / sumW) * 100);
  const pEc = 100 - pR - pRes;

  // Simulated index
  const sim = obras.map(o => {
    const si = Math.round(
      (o.dimensiones.recursos * wRecursos +
        o.dimensiones.residuos * wResiduos +
        o.dimensiones.economiaCircular * wEc) / sumW
    );
    return { ...o, sim: si };
  }).sort((a, b) => b.sim - a.sim);

  const simRows = sim.map((o, i) => {
    const nr = i + 1;
    const br = baseRank[o.obra];
    const move = br - nr;
    return {
      obra: o.obra,
      programa: o.programa,
      sim: o.sim,
      base: o.indice,
      rank: nr,
      color: scoreColor(o.sim),
      w: o.sim,
      move,
      moveLabel: move > 0 ? `▲ ${move}` : move < 0 ? `▼ ${Math.abs(move)}` : '=',
      moveColor: move > 0 ? '#0f766e' : move < 0 ? '#c0512f' : '#9aa6a1'
    };
  });

  const movimientos = simRows.filter(r => r.move !== 0).length;
  const estabLabel = movimientos === 0 ? 'Ranking estable' : `${movimientos} obras se reordenan`;
  const estabColor = movimientos === 0 ? '#0f766e' : '#b5852a';
  const estabBg = movimientos === 0 ? '#e9f3ef' : '#fbf3e2';

  return (
    <div className="simulador-view">
      {/* Controls */}
      <div className="card sim-controls">
        <div className="card-title">Pesos de dimensiones</div>
        <div className="card-subtitle" style={{ marginBottom: '20px' }}>
          Ajusta la importancia relativa de cada dimensión en el índice
        </div>

        <div className="slider-group">
          <div className="slider-header">
            <span className="slider-label">Recursos</span>
            <span className="mono slider-value">{pR}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={wRecursos}
            onChange={e => setWeights(+e.target.value, wResiduos, wEc)}
          />
        </div>

        <div className="slider-group">
          <div className="slider-header">
            <span className="slider-label">Residuos</span>
            <span className="mono slider-value">{pRes}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={wResiduos}
            onChange={e => setWeights(wRecursos, +e.target.value, wEc)}
          />
        </div>

        <div className="slider-group">
          <div className="slider-header">
            <span className="slider-label">Economía Circular</span>
            <span className="mono slider-value">{pEc}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={wEc}
            onChange={e => setWeights(wRecursos, wResiduos, +e.target.value)}
          />
        </div>

        <button className="btn-reset" onClick={resetWeights}>
          Restablecer (30 / 30 / 40)
        </button>

        <div className="stability-card" style={{ background: estabBg }}>
          <div className="stability-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={estabColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12h4l3 8 4-16 3 8h4"/>
            </svg>
          </div>
          <div className="stability-info">
            <div className="stability-label">Estabilidad del índice</div>
            <div className="stability-status" style={{ color: estabColor }}>{estabLabel}</div>
          </div>
        </div>
      </div>

      {/* Simulated Ranking */}
      <div className="card sim-ranking">
        <div className="table-header">
          <div>
            <div className="card-title">Ranking simulado</div>
            <div className="card-subtitle">Recalculado en tiempo real · ▲▼ = cambio vs. ranking oficial</div>
          </div>
        </div>
        <div className="sim-columns">
          <div className="col-rank">#</div>
          <div className="col-obra">Obra</div>
          <div className="col-programa">Prog.</div>
          <div className="col-move">Mov.</div>
          <div className="col-sim">Índice sim.</div>
        </div>
        {simRows.map((r, i) => (
          <div key={i} className="sim-row">
            <div className="col-rank mono">{r.rank}</div>
            <div className="col-obra">
              <div className="sim-obra-name">{r.obra}</div>
              <div className="mini-bar-track">
                <div
                  className="mini-bar-fill"
                  style={{ width: `${r.w}%`, background: r.color, transition: 'width .25s' }}
                ></div>
              </div>
            </div>
            <div className="col-programa">
              <span className="tag-programa">{r.programa}</span>
            </div>
            <div className="col-move mono" style={{ color: r.moveColor }}>{r.moveLabel}</div>
            <div className="col-sim">
              <span className="mono sim-value" style={{ color: r.color }}>{r.sim}</span>
              <span className="mono sim-base">de {r.base}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
