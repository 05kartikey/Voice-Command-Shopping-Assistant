import type { ParsedCommand, ShoppingItem } from '../types';
import { parseCommands as localParseCommands } from './nlp';

/**
 * Parses user speech via Google Gemini 3.7 Flash using the secure server-side endpoint (/api/parse-voice).
 * If offline or if the server is unreachable, gracefully falls back to the local multilingual NLP parser.
 */
export async function parseVoiceWithGemini(
  transcript: string,
  options?: {
    currentItems?: ShoppingItem[];
  }
): Promise<{ commands: ParsedCommand[]; source: 'gemini' | 'local' }> {
  if (!transcript || !transcript.trim()) {
    return { commands: [], source: 'local' };
  }

  const currentItems = options?.currentItems || [];

  // Secure Serverless Backend Call
  try {
    const serverRes = await fetch('/api/parse-voice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, currentItems }),
    });

    if (serverRes.ok) {
      const data = await serverRes.json();
      if (Array.isArray(data?.commands) && data.commands.length > 0) {
        const validated: ParsedCommand[] = data.commands.map((c: Partial<ParsedCommand>) => ({
          action: c.action || 'add',
          item: typeof c.item === 'string' ? c.item.trim() : '',
          quantity: typeof c.quantity === 'number' && !isNaN(c.quantity) ? c.quantity : 1,
          unit: typeof c.unit === 'string' ? c.unit.toLowerCase() : 'item',
          category: typeof c.category === 'string' ? c.category.toLowerCase() : undefined,
          searchQuery: c.searchQuery,
          maxPrice: c.maxPrice,
          destination: c.destination,
        }));
        return { commands: validated, source: 'gemini' };
      }
    }
  } catch (err) {
    console.warn('Serverless endpoint error, falling back to local NLP parser:', err);
  }

  // Fallback to local multi-language NLP parser
  return {
    commands: localParseCommands(transcript),
    source: 'local',
  };
}
