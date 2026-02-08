
export interface BlessingData {
  text: string;
  audioBase64?: string;
  imageUrl?: string;
}

export enum AppState {
  IDLE,
  LOADING,
  REVEALING,
  ERROR
}
