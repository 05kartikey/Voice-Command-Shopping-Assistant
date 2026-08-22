import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  const { t } = useTranslation();
  return (
    <div className="search-bar">
      <Search size={16} className="search-icon" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={t('searchPlaceholder')}
        aria-label="Search items"
      />
      {value && (
        <button onClick={() => onChange('')} className="clear-search" aria-label="Clear search">
          <X size={14} />
        </button>
      )}
    </div>
  );
}
