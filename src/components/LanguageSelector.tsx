import i18n from '../i18n';
import type { Language } from '../types';
import { Globe } from 'lucide-react';

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'en-US', label: 'English', flag: '🇺🇸' },
  { code: 'es-ES', label: 'Español', flag: '🇪🇸' },
  { code: 'fr-FR', label: 'Français', flag: '🇫🇷' },
  { code: 'de-DE', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'hi-IN', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'zh-CN', label: '中文', flag: '🇨🇳' },
];

interface Props {
  current: Language;
  onChange: (lang: Language) => void;
}

export default function LanguageSelector({ current, onChange }: Props) {
  const handleChange = (lang: Language) => {
    onChange(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <div className="lang-selector">
      <Globe size={14} />
      <select
        value={current}
        onChange={e => handleChange(e.target.value as Language)}
        aria-label="Select language"
      >
        {LANGUAGES.map(l => (
          <option key={l.code} value={l.code}>{l.flag} {l.label}</option>
        ))}
      </select>
    </div>
  );
}
