import { useState, useCallback, useEffect } from 'react';
import type { ShoppingItem } from '../types';
import { categorize } from '../utils/categories';
import { capitalize } from '../utils/nlp';

import { generateMockPrice } from '../utils/pricing';

const STORAGE_KEY = 'vsa_list';
const HISTORY_KEY = 'vsa_history';
const DISMISSED_KEY = 'vsa_dismissed';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota exceeded */ }
}

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>(() => load(STORAGE_KEY, []));
  const [history, setHistory] = useState<ShoppingItem[]>(() => load(HISTORY_KEY, []));
  const [dismissed, setDismissed] = useState<string[]>(() => load(DISMISSED_KEY, []));

  useEffect(() => save(STORAGE_KEY, items), [items]);
  useEffect(() => save(HISTORY_KEY, history), [history]);
  useEffect(() => save(DISMISSED_KEY, dismissed), [dismissed]);

  const addItem = useCallback((name: string, quantity = 1, unit = 'item') => {
    const trimmed = capitalize(name.trim());
    if (!trimmed) return null;

    setItems(prev => {
      const existing = prev.find(i => i.name.toLowerCase() === trimmed.toLowerCase());
      if (existing) {
        return prev.map(i =>
          i.id === existing.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      const newItem: ShoppingItem = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: trimmed,
        quantity,
        unit,
        category: categorize(trimmed),
        price: generateMockPrice(trimmed),
        checked: false,
        addedAt: Date.now(),
      };
      return [...prev, newItem];
    });
    return trimmed;
  }, []);

  const removeItem = useCallback((nameOrId: string) => {
    setItems(prev => {
      const item = prev.find(
        i => i.id === nameOrId || i.name.toLowerCase().includes(nameOrId.toLowerCase())
      );
      if (item) {
        setHistory(h => [...h.slice(-99), item]);
        return prev.filter(i => i.id !== item.id);
      }
      return prev;
    });
  }, []);

  const toggleCheck = useCallback((id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  }, []);

  const checkByName = useCallback((name: string) => {
    setItems(prev => prev.map(i =>
      i.name.toLowerCase().includes(name.toLowerCase()) ? { ...i, checked: true } : i
    ));
  }, []);

  const clearList = useCallback(() => {
    setItems(prev => {
      setHistory(h => [...h.slice(-(100 - prev.length)), ...prev]);
      return [];
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.id !== id));
    } else {
      setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
    }
  }, []);

  const dismissSuggestion = useCallback((name: string) => {
    setDismissed(prev => prev.includes(name.toLowerCase()) ? prev : [...prev, name.toLowerCase()]);
  }, []);

  const clearDismissed = useCallback(() => setDismissed([]), []);

  const clearHistory = useCallback(() => setHistory([]), []);

  const removeFromHistory = useCallback((id: string) => {
    setHistory(prev => prev.filter(i => i.id !== id));
  }, []);

  const uncheckByName = useCallback((name: string) => {
    setItems(prev => prev.map(i =>
      i.name.toLowerCase().includes(name.toLowerCase()) ? { ...i, checked: false } : i
    ));
  }, []);

  const clearChecked = useCallback(() => {
    setItems(prev => {
      const checkedItems = prev.filter(i => i.checked);
      setHistory(h => [...h.slice(-(100 - checkedItems.length)), ...checkedItems]);
      return prev.filter(i => !i.checked);
    });
  }, []);

  const adjustQuantityByName = useCallback((name: string, delta: number) => {
    setItems(prev => {
      return prev.map(i => {
        if (i.name.toLowerCase().includes(name.toLowerCase())) {
          return { ...i, quantity: Math.max(1, i.quantity + delta) };
        }
        return i;
      });
    });
  }, []);

  return { 
    items, history, dismissed, 
    addItem, removeItem, toggleCheck, checkByName, uncheckByName,
    clearList, clearChecked, updateQuantity, adjustQuantityByName,
    dismissSuggestion, clearDismissed, clearHistory, removeFromHistory 
  };
}
