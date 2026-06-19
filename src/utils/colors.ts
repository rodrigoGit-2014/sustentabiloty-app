export const scoreColor = (v: number): string => {
  if (v >= 80) return '#0f766e';
  if (v >= 68) return '#b5852a';
  return '#c0512f';
};

export const scoreTint = (v: number): string => {
  if (v >= 80) return '#e4f0ed';
  if (v >= 68) return '#f5edda';
  return '#f6e7e0';
};

export const clusterMeta = (cluster: string): { color: string; tint: string } => {
  const map: Record<string, { color: string; tint: string }> = {
    'Líderes Ambientales': { color: '#0f766e', tint: '#e4f0ed' },
    'Prometedor': { color: '#2f7d8f', tint: '#e3eff2' },
    'Desempeño Intermedio': { color: '#b5852a', tint: '#f5edda' },
    'En Riesgo': { color: '#c0512f', tint: '#f6e7e0' }
  };
  return map[cluster] || { color: '#5d6b66', tint: '#eceeec' };
};

export const ACCENT = '#0f766e';
export const ACCENT_DARK = '#0a5a54';
export const ACCENT_TINT = '#e7f1ef';
