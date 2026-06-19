import type { Obra, EvolutionData, Report } from '../types';

export const OBRAS: Obra[] = [
  {
    obra: 'Curicó Norte',
    programa: 'DS49',
    estado: 'FINALIZADA',
    indice: 84,
    scores: { agua: 88, energia: 92, escombros: 79, tierra: 82, reciclaje: 81, metalcon: 90 },
    dimensiones: { recursos: 90, residuos: 81, economiaCircular: 85 },
    cluster: 'Líderes Ambientales',
    insights: ['Consumo de agua inferior al promedio DS49.', 'Alto desempeño en reciclaje Metalcon.']
  },
  {
    obra: 'Molina Oriente',
    programa: 'DS19',
    estado: 'FINALIZADA',
    indice: 72,
    scores: { agua: 75, energia: 68, escombros: 62, tierra: 70, reciclaje: 78, metalcon: 60 },
    dimensiones: { recursos: 72, residuos: 66, economiaCircular: 69 },
    cluster: 'Desempeño Intermedio',
    insights: ['Buen desempeño en reciclaje convencional.', 'Oportunidad de mejora en gestión de escombros.']
  },
  {
    obra: 'Talca Sur',
    programa: 'DS49',
    estado: 'EN EJECUCIÓN',
    indice: 78,
    scores: { agua: 85, energia: 82, escombros: 65, tierra: 72, reciclaje: 70, metalcon: 74 },
    dimensiones: { recursos: 84, residuos: 69, economiaCircular: 72 },
    cluster: 'Prometedor',
    insights: ['Índice preliminar sujeto a cambios por avance de obra.', 'El desempeño en recursos supera el promedio del programa.']
  },
  {
    obra: 'Chillán Centro',
    programa: 'INM',
    estado: 'FINALIZADA',
    indice: 66,
    scores: { agua: 60, energia: 72, escombros: 58, tierra: 64, reciclaje: 55, metalcon: 50 },
    dimensiones: { recursos: 66, residuos: 61, economiaCircular: 53 },
    cluster: 'En Riesgo',
    insights: ['Desempeño inferior al promedio INM.', 'Priorizar estrategias de reciclaje.']
  }
];

export const EVOL: EvolutionData = {
  labels: ['Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
  values: [67, 68, 70, 69, 71, 72, 71, 73, 74, 75, 74, 75]
};

export const REPORTS: Report[] = [
  { id: 'pdf', title: 'Reporte Ejecutivo PDF', desc: 'Índice global, ranking oficial y hallazgos clave para gerencia.', tag: 'PDF', meta: '8 páginas' },
  { id: 'esg', title: 'Reporte ESG', desc: 'Indicadores ambientales estructurados según marco de reportabilidad.', tag: 'ESG', meta: '14 páginas' },
  { id: 'xls', title: 'Exportación Excel', desc: 'Scores por indicador y dimensión, listos para análisis propio.', tag: 'XLSX', meta: '4 hojas' },
  { id: 'ppt', title: 'Presentación Directorio', desc: 'Deck ejecutivo: evolución anual y comparativo por programa.', tag: 'PPTX', meta: '12 slides' }
];

export const DATASETS = [
  { name: 'Servicios Básicos', ind: 'Consumo Agua m³/Viv · KWh/Viv' },
  { name: 'Movimiento de Tierra', ind: 'm³/Viv a la fecha' },
  { name: 'Reciclaje', ind: 'Kg/Viv · Metalcon/Viv · m³/Viv' },
  { name: 'Escombros', ind: 'm³/Viv a la fecha' }
];

export const VALIDATIONS = [
  { check: 'Esquema de columnas', detail: '24 columnas reconocidas en los 4 datasets' },
  { check: 'Llave de unión por obra', detail: '4/4 obras cruzan correctamente entre hojas' },
  { check: 'Valores faltantes', detail: '0 nulos en indicadores obligatorios' },
  { check: 'Rangos de indicadores', detail: 'Todos los valores dentro de rangos esperados' },
  { check: 'Programas habitacionales', detail: 'DS49, DS19, INM detectados · DS01 sin registros' }
];

export const SCORE_KEYS = ['agua', 'energia', 'escombros', 'tierra', 'reciclaje', 'metalcon'] as const;
export type ScoreKey = typeof SCORE_KEYS[number];

export const SCORE_LABELS: Record<ScoreKey, string> = {
  agua: 'Agua',
  energia: 'Energía',
  escombros: 'Escombros',
  tierra: 'Mov. Tierra',
  reciclaje: 'Reciclaje',
  metalcon: 'Metalcon'
};
