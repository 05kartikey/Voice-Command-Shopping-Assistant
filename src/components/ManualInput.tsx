import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, X } from 'lucide-react';

interface Props {
  onAdd: (name: string, qty: number, unit: string) => void;
}

export default function ManualInput({ onAdd }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [qty, setQty] = useState(1);
  const [unit, setUnit] = useState('item');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), qty, unit);
    setName('');
    setQty(1);
    setUnit('item');
    setOpen(false);
  };

  if (!open) {
    return (
      <button className="manual-add-btn" onClick={() => setOpen(true)}>
        <Plus size={16} /> {t('addItem')}
      </button>
    );
  }

  return (
    <form className="manual-form" onSubmit={submit}>
      <input
        ref={inputRef}
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Item name..."
        className="manual-input"
      />
      <input
        type="number"
        value={qty}
        onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
        min={1}
        className="qty-input"
        aria-label="Quantity"
      />
      <select value={unit} onChange={e => setUnit(e.target.value)} className="unit-select">
        {['item', 'kg', 'g', 'lb', 'l', 'ml', 'bottle', 'can', 'pack', 'bag', 'box', 'dozen'].map(u => (
          <option key={u} value={u}>{u}</option>
        ))}
      </select>
      <button type="submit" className="submit-btn" disabled={!name.trim()}>
        <Plus size={16} />
      </button>
      <button type="button" className="cancel-btn" onClick={() => setOpen(false)}>
        <X size={16} />
      </button>
    </form>
  );
}
