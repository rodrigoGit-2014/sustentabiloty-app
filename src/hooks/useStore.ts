import { create } from 'zustand';
import type { ViewType, ProgramaType, ChatMessage } from '../types';

interface AppState {
  view: ViewType;
  uploadStep: number;
  calcProgress: number;
  selectedObra: string;
  query: string;
  programFilter: ProgramaType;
  sortField: 'indice' | 'obra';
  sortDir: 'asc' | 'desc';
  wRecursos: number;
  wResiduos: number;
  wEc: number;
  chat: ChatMessage[];
  chatInput: string;
  report: string | null;
  reportDone: Record<string, boolean>;

  // Actions
  setView: (view: ViewType) => void;
  setUploadStep: (step: number) => void;
  setCalcProgress: (progress: number) => void;
  setSelectedObra: (obra: string) => void;
  setQuery: (query: string) => void;
  setProgramFilter: (filter: ProgramaType) => void;
  toggleSort: (field: 'indice' | 'obra') => void;
  setWeights: (recursos: number, residuos: number, ec: number) => void;
  resetWeights: () => void;
  addChatMessage: (message: ChatMessage) => void;
  setChatInput: (input: string) => void;
  setReport: (report: string | null) => void;
  setReportDone: (id: string) => void;
  openObra: (obra: string) => void;
}

export const useStore = create<AppState>((set) => ({
  view: 'upload',
  uploadStep: 0,
  calcProgress: 0,
  selectedObra: 'Curicó Norte',
  query: '',
  programFilter: 'Todos',
  sortField: 'indice',
  sortDir: 'desc',
  wRecursos: 30,
  wResiduos: 30,
  wEc: 40,
  chat: [],
  chatInput: '',
  report: null,
  reportDone: {},

  setView: (view) => set({ view }),
  setUploadStep: (uploadStep) => set({ uploadStep }),
  setCalcProgress: (calcProgress) => set({ calcProgress }),
  setSelectedObra: (selectedObra) => set({ selectedObra }),
  setQuery: (query) => set({ query }),
  setProgramFilter: (programFilter) => set({ programFilter }),
  toggleSort: (field) => set((state) => ({
    sortField: field,
    sortDir: state.sortField === field && state.sortDir === 'desc' ? 'asc' : 'desc'
  })),
  setWeights: (wRecursos, wResiduos, wEc) => set({ wRecursos, wResiduos, wEc }),
  resetWeights: () => set({ wRecursos: 30, wResiduos: 30, wEc: 40 }),
  addChatMessage: (message) => set((state) => ({ chat: [...state.chat, message] })),
  setChatInput: (chatInput) => set({ chatInput }),
  setReport: (report) => set({ report }),
  setReportDone: (id) => set((state) => ({ reportDone: { ...state.reportDone, [id]: true } })),
  openObra: (obra) => set({ selectedObra: obra, view: 'detalle' })
}));
