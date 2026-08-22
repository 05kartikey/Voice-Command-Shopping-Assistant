import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import type { Suggestion } from '../types';
import { CATEGORY_ICONS } from '../utils/categories';

interface Props {
  suggestions: Suggestion[];
  onAdd: (name: string) => void;
}

export default function Suggestions({ suggestions, onAdd }: Props) {
  const { t } = useTranslation();
  if (suggestions.length === 0) return null;

  return (
    <div className="suggestions-panel">
      <div className="suggestions-header">
        <div className="suggestions-title">
          <Sparkles size={14} />
          {t('suggestions')}
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--text3)' }}>Tap to add</span>
      </div>
      <div className="suggestions-scroll">
        {suggestions.map(s => (
          <button key={s.name} className="suggestion-card" onClick={() => onAdd(s.name)}>
            <div className="sug-emoji">{CATEGORY_ICONS[s.category] || '🛒'}</div>
            <span className="sug-name">{s.name}</span>
            <span className="sug-reason">{s.reason}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
