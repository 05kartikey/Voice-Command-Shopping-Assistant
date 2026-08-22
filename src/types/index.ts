export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  price?: number;
  checked: boolean;
  addedAt: number;
}

export interface Suggestion {
  name: string;
  reason: string;
  category: string;
}

export type Language = 'en-US' | 'es-ES' | 'fr-FR' | 'de-DE' | 'hi-IN' | 'zh-CN';

export interface VoiceState {
  listening: boolean;
  transcript: string;
  error: string | null;
  supported: boolean;
}
