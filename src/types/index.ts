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

export type Language = 
  | 'auto' | 'en-US' | 'hi-IN' | 'es-ES' | 'fr-FR' | 'de-DE' | 'it-IT' | 'pt-BR'
  | 'ja-JP' | 'ko-KR' | 'ar-SA' | 'ru-RU' | 'zh-CN' | 'bn-IN' | 'mr-IN' | 'ta-IN' | 'te-IN' | string;

export interface ParsedCommand {
  action: 'add' | 'remove' | 'check' | 'clear' | 'search' | 'unknown' | 'uncheck' | 'increase' | 'decrease' | 'navigate' | 'clear_checked' | 'total' | 'set_quantity';
  item: string;
  quantity: number;
  unit: string;
  category?: string;
  searchQuery?: string;
  maxPrice?: number;
  destination?: string;
}

export interface VoiceState {
  listening: boolean;
  transcript: string;
  error: string | null;
  supported: boolean;
}
