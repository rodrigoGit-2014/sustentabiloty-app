import { useEffect, useRef } from 'react';
import { useStore } from '../../hooks/useStore';
import { DATASETS, VALIDATIONS } from '../../data/obras';

export function UploadFlow() {
  const { uploadStep, calcProgress, setUploadStep, setCalcProgress, setView } = useStore();
  const intervalRef = useRef<number | null>(null);

  const stepLabels = ['Carga de archivos', 'Validación de datos', 'Cálculo del índice', 'Listo'];

  const startCalc = () => {
    setUploadStep(2);
    setCalcProgress(0);
    intervalRef.current = window.setInterval(() => {
      setCalcProgress(calcProgress + 4);
    }, 55);
  };

  useEffect(() => {
    if (uploadStep === 2 && calcProgress < 100) {
      intervalRef.current = window.setInterval(() => {
        useStore.setState(state => {
          const p = Math.min(100, state.calcProgress + 4);
          if (p >= 100) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return { calcProgress: 100, uploadStep: 3 };
          }
          return { calcProgress: p };
        });
      }, 55);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [uploadStep]);

  return (
    <div className="upload-flow">
      <div className="upload-container">
        <div className="upload-brand">
          <div className="brand-icon">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3c4 4 6 7 6 10a6 6 0 0 1-12 0c0-3 2-6 6-10Z"/>
              <path d="M12 21V9"/>
            </svg>
          </div>
          <div className="brand-text">
            <div className="brand-title">Sustainability Intelligence Platform</div>
            <div className="brand-sub">Constructora Independencia</div>
          </div>
        </div>

        {/* Stepper */}
        <div className="stepper">
          {stepLabels.map((label, i) => {
            const state = uploadStep > i ? 'done' : uploadStep === i ? 'active' : 'pending';
            return (
              <div key={i} className="stepper-item">
                <div className={`stepper-circle ${state}`}>
                  {state === 'done' ? '✓' : i + 1}
                </div>
                <div className="stepper-label">{label}</div>
              </div>
            );
          })}
        </div>

        <div className="upload-card">
          {/* Step 0: Carga */}
          {uploadStep === 0 && (
            <div className="step-content">
              <div className="step-header">
                <div>
                  <div className="step-title">Carga de archivos</div>
                  <div className="step-subtitle">Fuente de datos del modelo de sostenibilidad</div>
                </div>
                <span className="tag-xlsx">XLSX</span>
              </div>

              <div className="file-drop">
                <div className="file-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f7a3a" strokeWidth="1.9">
                    <path d="M14 3v5h5"/>
                    <path d="M7 3h7l5 5v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/>
                    <path d="M9 13h6M9 16h6" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="file-info">
                  <div className="file-name">dataset_sostenibilidad.xlsx</div>
                  <div className="file-meta">4 hojas · 312 KB · cargado correctamente</div>
                </div>
                <div className="file-check">✓</div>
              </div>

              <div className="datasets-grid">
                {DATASETS.map((d, i) => (
                  <div key={i} className="dataset-card">
                    <div className="dataset-check">✓</div>
                    <div className="dataset-info">
                      <div className="dataset-name">{d.name}</div>
                      <div className="dataset-ind">{d.ind}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="btn-primary" onClick={() => setUploadStep(1)}>
                Validar datos →
              </button>
            </div>
          )}

          {/* Step 1: Validación */}
          {uploadStep === 1 && (
            <div className="step-content">
              <div className="step-title">Validación de datos</div>
              <div className="step-subtitle">Verificación de integridad antes del cálculo</div>

              <div className="validations-list">
                {VALIDATIONS.map((v, i) => (
                  <div key={i} className="validation-item">
                    <div className="validation-check">✓</div>
                    <div className="validation-info">
                      <div className="validation-title">{v.check}</div>
                      <div className="validation-detail">{v.detail}</div>
                    </div>
                    <div className="validation-ok">OK</div>
                  </div>
                ))}
              </div>

              <button className="btn-primary" onClick={startCalc}>
                Ejecutar cálculo del índice →
              </button>
            </div>
          )}

          {/* Step 2: Cálculo */}
          {uploadStep === 2 && (
            <div className="step-content step-calc">
              <div className="spinner"></div>
              <div className="step-title">Calculando Índice Global de Sostenibilidad</div>
              <div className="step-subtitle">Motor analítico · scores por indicador → dimensiones → índice</div>
              <div className="progress-track">
                <div className="progress-bar" style={{ width: `${calcProgress}%` }}></div>
              </div>
              <div className="progress-text mono">{calcProgress}%</div>
            </div>
          )}

          {/* Step 3: Done */}
          {uploadStep === 3 && (
            <div className="step-content step-done">
              <div className="done-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--ac)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 13 4 4L19 7"/>
                </svg>
              </div>
              <div className="step-title">Índice calculado para 4 obras</div>
              <div className="step-subtitle">Ranking oficial, clusters e insights generados correctamente</div>
              <button className="btn-primary" onClick={() => setView('dashboard')}>
                Entrar al dashboard →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
