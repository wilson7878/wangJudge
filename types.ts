export interface CaseData {
  complaintA: string;
  complaintB: string;
}

export interface VerdictResponse {
  markdownText: string;
}

export enum CourtState {
  IDLE = 'IDLE',
  THINKING = 'THINKING',
  VERDICT_READY = 'VERDICT_READY',
  ERROR = 'ERROR'
}

export type ActiveSide = 'A' | 'B' | null;
