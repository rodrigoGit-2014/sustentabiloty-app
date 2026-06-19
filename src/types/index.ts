export interface Obra {
  obra: string;
  programa: 'DS49' | 'DS19' | 'DS01' | 'INM';
  estado: 'FINALIZADA' | 'EN EJECUCIÓN';
  indice: number;
  scores: {
    agua: number;
    energia: number;
    escombros: number;
    tierra: number;
    reciclaje: number;
    metalcon: number;
  };
  dimensiones: {
    recursos: number;
    residuos: number;
    economiaCircular: number;
  };
  cluster: 'Líderes Ambientales' | 'Prometedor' | 'Desempeño Intermedio' | 'En Riesgo';
  insights: string[];
}

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

export interface EvolutionData {
  labels: string[];
  values: number[];
}

export type ViewType = 'upload' | 'dashboard' | 'ranking' | 'detalle' | 'simulador' | 'asistente' | 'reportes';

export type ProgramaType = 'Todos' | 'DS49' | 'DS19' | 'DS01' | 'INM';

export interface Report {
  id: string;
  title: string;
  desc: string;
  tag: string;
  meta: string;
}
