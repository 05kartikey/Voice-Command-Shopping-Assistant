import { useState, useEffect, useRef, useCallback } from 'react';
import type { VoiceState, Language } from '../types';

interface ISpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

export function useVoiceRecognition(language: Language, onResult: (transcript: string) => void) {
  const [state, setState] = useState<VoiceState>({
    listening: false,
    transcript: '',
    error: null,
    supported: typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition),
  });

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startingRef = useRef(false);

  const stop = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    startingRef.current = false;
    try { recognitionRef.current?.stop(); } catch { /* ignore */ }
    setState(s => ({ ...s, listening: false }));
  }, []);

  const start = useCallback(() => {
    if (!state.supported || startingRef.current) return;
    startingRef.current = true;

    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new Ctor();

    // Auto-detect language from system/browser or use specified language
    let targetLang = language;
    if (!targetLang || targetLang === 'auto') {
      targetLang = (typeof navigator !== 'undefined' ? (navigator.language || 'en-US') : 'en-US');
    }

    recognition.lang = targetLang;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => { startingRef.current = false; setState(s => ({ ...s, listening: true, error: null, transcript: '' })); };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((r: SpeechRecognitionResult) => r[0].transcript)
        .join('');
      setState(s => ({ ...s, transcript }));

      if (event.results[event.results.length - 1].isFinal) {
        onResult(transcript);
        stop();
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      startingRef.current = false;
      if (event.error === 'aborted') return; // ignore manual stop
      const msg =
        event.error === 'no-speech' ? 'No speech detected. Try again.' :
        event.error === 'not-allowed' ? 'Microphone access denied. Allow mic in browser settings.' :
        event.error === 'network' ? 'Network error. Check your internet connection and try again.' :
        event.error === 'audio-capture' ? 'No microphone found.' :
        event.error === 'service-not-allowed' ? 'Speech service not allowed. Use HTTPS or localhost.' :
        `Voice error: ${event.error}`;
      setState(s => ({ ...s, error: msg, listening: false }));
    };

    recognition.onend = () => { startingRef.current = false; setState(s => ({ ...s, listening: false })); };

    recognitionRef.current = recognition;
    try { recognition.start(); } catch { startingRef.current = false; setState(s => ({ ...s, error: 'Could not start voice recognition. Try again.', listening: false })); }

    timeoutRef.current = setTimeout(stop, 10000);
  }, [language, onResult, state.supported, stop]);

  const toggle = useCallback(() => {
    if (state.listening) stop();
    else start();
  }, [state.listening, start, stop]);

  useEffect(() => () => stop(), [stop]);

  return { ...state, toggle, stop };
}
