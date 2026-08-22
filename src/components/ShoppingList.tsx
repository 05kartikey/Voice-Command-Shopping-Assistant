import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, Check, Plus, Minus, Tag } from 'lucide-react';
import type { ShoppingItem } from '../types';
import { CATEGORY_ICONS } from '../utils/categories';
import { getSubstitutes } from '../utils/suggestions';

interface Props {
  items: ShoppingItem[];
  searchQuery: string;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
}

export default function ShoppingList({ items, searchQuery, onToggle, onRemove, onUpdateQty }: Props) {
  const { t } = useTranslation();
  const [expandedSubs, setExpandedSubs] = useState<string | null>(null);

  const filtered = searchQuery
    ? items.filter(i =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.category.toLowerCase().includes(searchQuery.toLowerCase()))
    : items;

  const grouped = filtered.reduce<Record<string, ShoppingItem[]>>((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});

  const checkedCount = items.filter(i => i.checked).length;
  const progress = items.length > 0 ? Math.round((checkedCount / items.length) * 100) : 0;

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🛒</div>
        <p>{t('noItems')}</p>
        <p className="commands-hint">{t('commands')}</p>
      </div>
    );
  }

  return (
    <div className="shopping-list">
      <div className="list-header">
        <div className="list-stats">
          <span>{items.length} {t('items')}</span>
          {checkedCount > 0 && (
            <span className="checked-badge">✓ {checkedCount} {t('checked')}</span>
          )}
        </div>
        {items.length > 0 && (
          <div className="progress-bar-wrap" title={`${progress}% done`}>
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      {filtered.length === 0 && searchQuery && (
        <p className="no-results">No items match "{searchQuery}"</p>
      )}

      {Object.entries(grouped).map(([category, catItems]) => (
        <div key={category} className="category-group">
          <div className="category-header">
            <span>{CATEGORY_ICONS[category] || '🛒'}</span>
            <span>{(t(`categories.${category}`) as string) || category}</span>
            <span className="cat-count">{catItems.length}</span>
          </div>

          {catItems.map(item => {
            const subs = getSubstitutes(item.name);
            return (
              <div key={item.id} className={`list-item ${item.checked ? 'checked' : ''}`}>
                <button className="check-btn" onClick={() => onToggle(item.id)} aria-label="Toggle">
                  <div className={`checkbox ${item.checked ? 'checked' : ''}`}>
                    {item.checked && <Check size={13} strokeWidth={3} />}
                  </div>
                </button>

                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <div className="qty-controls">
                    <button onClick={() => onUpdateQty(item.id, item.quantity - 1)} aria-label="Decrease">
                      <Minus size={11} />
                    </button>
                    <span className="qty">
                      {item.quantity}{item.unit !== 'item' ? ` ${item.unit}` : ''}
                    </span>
                    <button onClick={() => onUpdateQty(item.id, item.quantity + 1)} aria-label="Increase">
                      <Plus size={11} />
                    </button>
                  </div>
                </div>

                <div className="item-actions">
                  {subs.length > 0 && (
                    <button
                      className="sub-btn"
                      onClick={() => setExpandedSubs(expandedSubs === item.id ? null : item.id)}
                      title={`${t('substitute')} ${item.name}`}
                    >
                      <Tag size={14} />
                    </button>
                  )}
                  <button className="remove-btn" onClick={() => onRemove(item.id)} aria-label="Remove">
                    <Trash2 size={14} />
                  </button>
                </div>

                {expandedSubs === item.id && subs.length > 0 && (
                  <div className="substitutes">
                    <span className="sub-label">{t('substitute')} {item.name}</span>
                    <div className="sub-chips">
                      {subs.map(s => <span key={s} className="sub-chip">{s}</span>)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
