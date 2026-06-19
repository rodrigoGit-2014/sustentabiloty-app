import { useStore } from '../../hooks/useStore';

const suggestedQuestions = [
  '¿Por qué esta obra obtuvo este índice?',
  '¿Qué obras similares tienen mejor desempeño?',
  '¿Qué acciones podrían mejorar el índice?',
  '¿Qué programas presentan mejores resultados?',
  '¿Qué explica la diferencia entre dos obras?'
];

function getAnswer(q: string, selectedObra: string): string {
  const t = q.toLowerCase();

  if ((t.includes('por qué') || t.includes('porque')) && (t.includes('índice') || t.includes('indice') || t.includes('obtuvo'))) {
    return 'Curicó Norte alcanza 84/100 impulsada por su dimensión Recursos (90): el consumo de agua (88) y energía (92) está por debajo del promedio DS49. Su menor puntaje está en Residuos (81), donde la gestión de escombros (79) es el indicador más débil. El reciclaje Metalcon (90) la consolida como referente de Economía Circular.';
  }
  if (t.includes('similar') || t.includes('mejor desempeño')) {
    return 'Dentro del programa DS49, Curicó Norte (84) supera a Talca Sur (78, en ejecución). Frente a obras de otros programas, lidera el ranking oficial seguida de Molina Oriente (DS19, 72). La brecha principal con sus pares está en la dimensión Residuos.';
  }
  if (t.includes('acciones') || t.includes('mejorar')) {
    return 'Para elevar el índice, prioriza Residuos: 1) reducir generación de escombros con segregación en origen y reutilización de áridos; 2) optimizar movimiento de tierra mediante balance de cortes y rellenos. Cada +5 puntos en escombros aporta ~1.5 pts al índice global según el peso actual de la dimensión.';
  }
  if (t.includes('programa')) {
    return 'DS49 presenta el mejor desempeño promedio (81 pts, 2 obras), apalancado en eficiencia de recursos. DS19 se ubica en rango intermedio (72) e INM concentra el mayor riesgo ambiental (66), con reciclaje como brecha transversal. DS01 aún no registra obras analizadas.';
  }
  if (t.includes('diferencia') || t.includes('entre dos')) {
    return 'La diferencia entre Curicó Norte (84) y Chillán Centro (66) son 18 puntos, explicados sobre todo por Economía Circular (85 vs 53) y Recursos (90 vs 66). Chillán arrastra reciclaje (55) y Metalcon (50) muy por debajo del referente. Cerrar la mitad de esa brecha en reciclaje movería a Chillán fuera del cluster "En Riesgo".';
  }
  return `Basado en los datos de ${selectedObra} y del portafolio: el Índice Global se compone de Recursos, Residuos y Economía Circular. Indícame una obra o dimensión específica y detallo los drivers y las acciones de mayor impacto.`;
}

export function Asistente() {
  const { chat, chatInput, selectedObra, setChatInput, addChatMessage } = useStore();

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    addChatMessage({ role: 'user', text });
    const answer = getAnswer(text, selectedObra);
    addChatMessage({ role: 'ai', text: answer });
    setChatInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend(chatInput);
    }
  };

  return (
    <div className="asistente-view">
      <div className="card chat-card">
        <div className="chat-header">
          <div className="chat-avatar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a8 8 0 0 1-11.3 7.3L4 21l1.7-5.7A8 8 0 1 1 21 12Z"/>
            </svg>
          </div>
          <div className="chat-header-text">
            <div className="chat-title">Asistente de Sostenibilidad</div>
            <div className="chat-subtitle">Explica los resultados del modelo · orientado a la acción</div>
          </div>
        </div>

        <div className="chat-body">
          {chat.length === 0 ? (
            <div className="chat-empty">
              <div className="empty-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--ac)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a8 8 0 0 1-11.3 7.3L4 21l1.7-5.7A8 8 0 1 1 21 12Z"/>
                </svg>
              </div>
              <div className="empty-title">¿En qué puedo ayudarte?</div>
              <div className="empty-hint">Pregunta sobre el índice, las dimensiones o cómo mejorar una obra</div>
              <div className="suggestions">
                {suggestedQuestions.map((q, i) => (
                  <button key={i} className="suggestion-btn" onClick={() => handleSend(q)}>
                    <span className="suggestion-arrow">→</span> {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="chat-messages">
              {chat.map((m, i) => (
                <div key={i} className={`chat-message ${m.role}`}>
                  {m.role === 'ai' && (
                    <div className="ai-avatar">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ac)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a8 8 0 0 1-11.3 7.3L4 21l1.7-5.7A8 8 0 1 1 21 12Z"/>
                      </svg>
                    </div>
                  )}
                  <div className={`message-bubble ${m.role}`}>{m.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="chat-input-area">
          <input
            type="text"
            placeholder="Escribe tu pregunta…"
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="send-btn" onClick={() => handleSend(chatInput)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4Z"/>
              <path d="M22 2 11 13"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
