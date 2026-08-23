import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n';
import type { ParsedCommand } from './types';
import { parseVoiceWithGemini, getGeminiApiKey, setGeminiApiKey } from './utils/aiParser';
import { generateSuggestions, getSubstitutes } from './utils/suggestions';
import { useVoiceRecognition } from './hooks/useVoiceRecognition';
import { useShoppingList } from './hooks/useShoppingList';
import ToastContainer from './components/Toast';
import { toast } from './utils/toast';
import { CATEGORY_ICONS } from './utils/categories';
import './App.css';

const AISLE_ICONS: Record<string, string> = {
  produce: 'eco', dairy: 'egg_alt', bakery: 'bakery_dining',
  meat: 'set_meal', pantry: 'kitchen', beverages: 'local_cafe',
  snacks: 'cookie', frozen: 'ac_unit', household: 'cleaning_services',
  personal: 'spa', other: 'shopping_basket',
};

export default function App() {
  const { t } = useTranslation();

  const [search, setSearch] = useState('');
  const [heard, setHeard] = useState('');
  const [activeNav, setActiveNav] = useState<'voice'|'list'|'suggest'|'search'|'history'|'settings'>('voice');
  const [expandedSubs, setExpandedSubs] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number | null>(null);

  // AI Voice State
  const [geminiKeyInput, setGeminiKeyInput] = useState(() => getGeminiApiKey());
  const [hasApiKey, setHasApiKey] = useState(() => !!getGeminiApiKey());
  const [showKeyField, setShowKeyField] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [lastParsedCommands, setLastParsedCommands] = useState<ParsedCommand[]>([]);
  const [parseSource, setParseSource] = useState<'gemini' | 'local' | null>(null);

  const { 
    items, history, dismissed, 
    addItem, removeItem, toggleCheck, checkByName, uncheckByName,
    clearList, clearChecked, updateQuantity, adjustQuantityByName, setQuantityByName,
    dismissSuggestion, clearDismissed, clearHistory, removeFromHistory 
  } = useShoppingList();

  const handleVoice = useCallback(async (transcript: string) => {
    setHeard(transcript);
    setIsAiProcessing(true);

    try {
      const { commands, source } = await parseVoiceWithGemini(transcript, { currentItems: items });
      setParseSource(source);
      setLastParsedCommands(commands);

      if (!commands || commands.length === 0) {
        toast(t('didntUnderstand') || "Couldn't understand voice command", 'error');
        return;
      }

      let addedCount = 0;
      let removedCount = 0;
      let checkedCount = 0;
      let setQtyCount = 0;

      for (const cmd of commands) {
        switch (cmd.action) {
          case 'set_quantity':
            if (cmd.item) {
              setQuantityByName(cmd.item, cmd.quantity, cmd.unit, cmd.category);
              setQtyCount++;
            }
            break;
          case 'add':
            if (cmd.item) {
              addItem(cmd.item, cmd.quantity, cmd.unit, cmd.category);
              addedCount++;
            }
            break;
          case 'remove':
            if (cmd.item) {
              removeItem(cmd.item);
              removedCount++;
            }
            break;
          case 'check':
            if (cmd.item) {
              checkByName(cmd.item);
              checkedCount++;
            }
            break;
          case 'clear':
            clearList();
            toast('List cleared', 'info');
            break;
          case 'clear_checked':
            clearChecked();
            toast('Cleared all purchased items', 'info');
            break;
          case 'search':
            setSearchFilter(cmd.searchQuery || '');
            setMaxPriceFilter(cmd.maxPrice || null);
            setActiveNav('search');
            if (cmd.maxPrice) {
              toast(`Searching for "${cmd.searchQuery || 'items'}" under $${cmd.maxPrice}`, 'info');
            } else {
              toast(`Searching for "${cmd.searchQuery}"`, 'info');
            }
            break;
          case 'uncheck':
            if (cmd.item) {
              uncheckByName(cmd.item);
              toast(`Unchecked "${cmd.item}"`, 'info');
            }
            break;
          case 'increase':
            if (cmd.item) {
              adjustQuantityByName(cmd.item, cmd.quantity);
              toast(`Added ${cmd.quantity} more "${cmd.item}"`, 'success');
            }
            break;
          case 'decrease':
            if (cmd.item) {
              adjustQuantityByName(cmd.item, -cmd.quantity);
              toast(`Removed ${cmd.quantity} "${cmd.item}"`, 'info');
            }
            break;
          case 'navigate': {
            const dest = cmd.destination?.toLowerCase() || '';
            if (dest.includes('history') || dest.includes('past')) setActiveNav('history');
            else if (dest.includes('suggest') || dest.includes('smart')) setActiveNav('suggest');
            else if (dest.includes('setting') || dest.includes('options')) setActiveNav('settings');
            else if (dest.includes('search') || dest.includes('find')) setActiveNav('search');
            else setActiveNav('list');
            toast(`Navigated to ${dest}`, 'info');
            break;
          }
          case 'total': {
            const total = items.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);
            toast(`Your estimated total is $${total.toFixed(2)}`, 'info');
            break;
          }
          default:
            break;
        }
      }

      // Provide clear feedback toasts
      if (setQtyCount > 0) {
        if (commands.length === 1 && commands[0].action === 'set_quantity') {
          toast(`Set "${commands[0].item}" to ${commands[0].quantity}`, 'success');
        } else {
          toast(`Updated quantity for ${setQtyCount} item${setQtyCount > 1 ? 's' : ''}`, 'success');
        }
        setActiveNav('list');
      }
      if (addedCount > 0) {
        if (commands.length === 1 && commands[0].action === 'add') {
          toast(`Added "${commands[0].item}" (${commands[0].quantity} ${commands[0].unit !== 'item' ? commands[0].unit : ''})`, 'success');
        } else {
          toast(`Added ${addedCount} item${addedCount > 1 ? 's' : ''} to your list!`, 'success');
        }
        setActiveNav('list');
      }
      if (removedCount > 0) {
        toast(`Removed ${removedCount} item${removedCount > 1 ? 's' : ''}`, 'info');
      }
      if (checkedCount > 0) {
        toast(`Checked off ${checkedCount} item${checkedCount > 1 ? 's' : ''}`, 'success');
      }
    } catch (err) {
      console.error('Error handling voice command:', err);
      toast('Failed to process voice command', 'error');
    } finally {
      setIsAiProcessing(false);
    }
  }, [addItem, removeItem, checkByName, uncheckByName, clearList, clearChecked, adjustQuantityByName, setQuantityByName, items, t]);

  const voice = useVoiceRecognition('auto', handleVoice);
  const allSuggestions = useMemo(() => generateSuggestions(items, history), [items, history]);
  const suggestions = useMemo(() => allSuggestions.filter(s => !dismissed.includes(s.name.toLowerCase())), [allSuggestions, dismissed]);

  const matchSearch = (query: string, text: string, category: string) => {
    if (!query) return true;
    const terms = query.toLowerCase().trim().split(/\s+/);
    const target = (text + ' ' + category).toLowerCase();
    return terms.every(term => target.includes(term));
  };

  const listFiltered = items.filter(i => matchSearch(search, i.name, i.category) && (maxPriceFilter === null || (i.price && i.price <= maxPriceFilter)));
  const searchFiltered = items.filter(i => matchSearch(searchFilter, i.name, i.category) && (maxPriceFilter === null || (i.price && i.price <= maxPriceFilter)));

  const grouped = listFiltered.reduce<Record<string, typeof items>>((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});

  const checkedCount = items.filter(i => i.checked).length;
  const progress = items.length ? (checkedCount / items.length) * 100 : 0;

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    addItem(newItemName.trim(), newItemQty, 'item');
    toast(`Added "${newItemName.trim()}"`, 'success');
    setNewItemName(''); setNewItemQty(1);
  };

  const stockSugs = suggestions.filter(s => s.reason.includes('times'));
  const pairingSugs = suggestions.filter(s => s.reason.includes('well with'));
  const seasonalSugs = suggestions.filter(s => s.reason === 'In season right now');

  const NAV = [
    { id: 'voice', icon: 'mic', label: t('voice') },
    { id: 'list', icon: 'list_alt', label: t('myLists') },
    { id: 'suggest', icon: 'lightbulb', label: t('suggestions') },
    { id: 'search', icon: 'search', label: t('search') },
    { id: 'history', icon: 'history', label: t('history') },
    { id: 'settings', icon: 'settings', label: t('settings') },
  ];

  return (
    <div className="vc-root">

      {/* ── TOP NAV ── */}
      <nav className="vc-topnav">
        <button className="vc-topnav-menu" onClick={() => setSidebarOpen(o => !o)}>
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span className="vc-topnav-brand">VocalCart</span>
        <div className="vc-topnav-right">
          <button className="vc-icon-btn" onClick={() => toast('No new notifications', 'info')}><span className="material-symbols-outlined">notifications</span></button>
          <button className="vc-icon-btn" onClick={() => setActiveNav('list')}><span className="material-symbols-outlined">shopping_cart</span></button>
          <div className="vc-avatar">V</div>
        </div>
      </nav>

      {/* ── SIDEBAR ── */}
      <aside className={`vc-sidebar ${sidebarOpen ? 'vc-sidebar--open' : ''}`}>
        <div className="vc-sidebar-top">
          <span className="vc-sidebar-brand">VocalCart</span>
        </div>
        <div className="vc-sidebar-user">
          <div className="vc-sidebar-avatar">V</div>
          <div>
            <p className="vc-sidebar-name">{t('welcomeBack')}</p>
            <p className="vc-sidebar-sub">{t('companion')}</p>
          </div>
        </div>
        <button className="vc-new-list-btn" onClick={() => { clearList(); toast('New list started', 'info'); setSidebarOpen(false); }}>
          <span className="material-symbols-outlined">add</span> {t('newList')}
        </button>
        <nav className="vc-sidenav">
          {NAV.map(n => (
            <button key={n.id} className={`vc-sidenav-item ${activeNav === n.id ? 'active' : ''}`}
              onClick={() => { setActiveNav(n.id as typeof activeNav); setSidebarOpen(false); }}>
              <span className="material-symbols-outlined" style={activeNav === n.id ? { fontVariationSettings: "'FILL' 1" } : {}}>{n.icon}</span>
              <span>{n.label}</span>
              {n.id === 'suggest' && suggestions.length > 0 && <span className="vc-nav-badge">{suggestions.length}</span>}
            </button>
          ))}
        </nav>
        <div className="vc-sidebar-footer">
          <button className="vc-sidenav-item" onClick={() => toast('Help center coming soon!', 'info')}><span className="material-symbols-outlined">help</span><span>{t('help')}</span></button>
          <button className="vc-sidenav-item" onClick={() => toast('Privacy policy coming soon!', 'info')}><span className="material-symbols-outlined">shield</span><span>{t('privacy')}</span></button>
        </div>
      </aside>
      {sidebarOpen && <div className="vc-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* ── MAIN ── */}
      <main className="vc-main">

        {/* ══ VOICE DASHBOARD ══ */}
        {activeNav === 'voice' && (
          <div className="vc-voice-page">
            <div className="vc-voice-left">
              {/* AI Mode Tag */}
              <div className="vc-voice-mode-tag-wrap">
                <button
                  type="button"
                  className={`vc-voice-mode-tag ${hasApiKey ? 'vc-voice-mode-tag--ai' : 'vc-voice-mode-tag--local'}`}
                  onClick={() => setActiveNav('settings')}
                  title="Click to configure Gemini AI in Settings"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>
                    {hasApiKey ? 'auto_awesome' : 'offline_bolt'}
                  </span>
                  <span>{hasApiKey ? 'Gemini 3.7 Flash AI Active' : 'Local Multi-Item Parser'}</span>
                  <span className="vc-voice-mode-arrow material-symbols-outlined" style={{ fontSize: '14px' }}>tune</span>
                </button>
              </div>

              {/* Mic orb */}
              <div className="vc-mic-wrap">
                <div className={`vc-pulse-ring vc-pulse-ring-1 ${voice.listening || isAiProcessing ? 'active' : ''}`} />
                <div className={`vc-pulse-ring vc-pulse-ring-2 ${voice.listening || isAiProcessing ? 'active' : ''}`} style={{ animationDelay: '0.5s' }} />
                <button
                  className={`vc-mic-orb ${voice.listening ? 'on' : ''} ${isAiProcessing ? 'ai-thinking' : ''} ${!voice.supported ? 'disabled' : ''}`}
                  onClick={voice.toggle} disabled={!voice.supported || isAiProcessing}
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: '3rem' }}>
                    {isAiProcessing ? 'auto_awesome' : (voice.listening ? 'mic_off' : 'mic')}
                  </span>
                </button>
              </div>

              {/* Transcript card */}
              <div className="vc-transcript-card">
                {isAiProcessing ? (
                  <div className="vc-ai-analyzing-msg">
                    <span className="material-symbols-outlined vc-sparkle-spin" style={{ color: 'var(--primary)', fontSize: '20px' }}>auto_awesome</span>
                    <span>AI analyzing speech, filtering banter & extracting items...</span>
                  </div>
                ) : (
                  <p className="vc-transcript-text">
                    {voice.listening
                      ? (voice.transcript
                          ? <>"<span className="vc-transcript-highlight">{voice.transcript}</span>"</>
                          : <span className="vc-transcript-muted">{t('listening')}</span>)
                      : heard
                        ? <>"<span className="vc-transcript-highlight">{heard}</span>"</>
                        : <span className="vc-transcript-muted">"Add 2 liters of milk and 2 apples..."</span>
                    }
                  </p>
                )}
                {voice.listening && (
                  <div className="vc-voice-wave">
                    {[10,20,35,15,25].map((h,i) => (
                      <div key={i} className="vc-voice-bar" style={{ height: h, animationDelay: `${i*0.1}s` }} />
                    ))}
                  </div>
                )}
                {!voice.listening && !isAiProcessing && (
                  <p className="vc-transcript-hint">
                    {!voice.supported ? '⚠ Use Chrome or Edge for voice' : t('voiceHint')}
                  </p>
                )}
              </div>

              {/* Last Extracted Items preview */}
              {!voice.listening && !isAiProcessing && lastParsedCommands.length > 0 && (
                <div className="vc-extracted-preview">
                  <div className="vc-extracted-header">
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>check_circle</span>
                    <span>Extracted {lastParsedCommands.length} Action{lastParsedCommands.length > 1 ? 's' : ''} ({parseSource === 'gemini' ? 'Gemini AI' : 'Smart Local Parser'}):</span>
                  </div>
                  <div className="vc-extracted-tags">
                    {lastParsedCommands.map((c, i) => (
                      <span key={i} className="vc-extracted-chip">
                        <strong>{c.action.toUpperCase()}</strong>: {c.quantity > 1 ? `${c.quantity} ` : ''}{c.unit !== 'item' ? `${c.unit} ` : ''}{c.item || c.searchQuery || c.destination || ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {voice.error && (
                <div className="vc-voice-error">
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>error</span>
                  <span>{voice.error}</span>
                  <button className="vc-voice-error-retry" onClick={() => { voice.toggle(); }}>Retry</button>
                </div>
              )}

              {/* Quick action chips */}
              <div className="vc-quick-chips">
                {[
                  { icon: 'shopping_basket', label: t('addItem'), action: () => setActiveNav('list') },
                  { icon: 'delete_sweep', label: t('clearList'), action: () => { clearList(); toast('List cleared', 'info'); } },
                  { icon: 'search', label: t('search'), action: () => setActiveNav('search') },
                  { icon: 'lightbulb', label: t('suggestions'), action: () => setActiveNav('suggest') },
                ].map(c => (
                  <button key={c.label} className="vc-quick-chip" onClick={c.action}>
                    <span className="material-symbols-outlined">{c.icon}</span>
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: live list panel */}
            <div className="vc-voice-right">
              <div className="vc-panel">
                <div className="vc-panel-header">
                  <h3 className="vc-panel-title">{t('groceryList')}</h3>
                  <span className="vc-count-badge">{items.length} {t('itemsCaps')}</span>
                </div>
                <div className="vc-panel-body">
                  {items.length === 0 ? (
                    <div className="vc-empty">
                      <span className="material-symbols-outlined" style={{ fontSize: '2.5rem', color: 'var(--outline)' }}>shopping_cart</span>
                      <p>{t('emptyList')}</p>
                      <p style={{ fontSize: '0.82rem', color: 'var(--outline)' }}>{t('emptyListHint')}</p>
                    </div>
                  ) : (
                    Object.entries(grouped).map(([cat, catItems]) => (
                      <div key={cat} className="vc-panel-cat">
                        <h4 className="vc-panel-cat-title">{(t(`categories.${cat}`) as string) || cat}</h4>
                        <ul>
                          {catItems.map(item => (
                            <li key={item.id} className={`vc-panel-item ${item.checked ? 'done' : ''}`}>
                              <div className="vc-panel-item-img">
                                <span style={{ fontSize: '1.4rem' }}>{CATEGORY_ICONS[item.category] || '🛒'}</span>
                              </div>
                              <div className="vc-panel-item-info">
                                <p className="vc-panel-item-name">{item.name}</p>
                                <p className="vc-panel-item-qty">QTY: {item.quantity}{item.unit !== 'item' ? ` ${item.unit.toUpperCase()}` : ''}</p>
                              </div>
                              <button className="vc-panel-del" onClick={() => removeItem(item.id)}>
                                <span className="material-symbols-outlined">close</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))
                  )}
                </div>
                {items.length > 0 && (
                  <div className="vc-panel-footer">
                    <button className="vc-checkout-btn" onClick={() => setActiveNav('list')}>
                      {t('viewFullList')} <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══ MY LIST (Shopping List page) ══ */}
        {activeNav === 'list' && (
          <div className="vc-list-page">
            <div className="vc-list-page-header">
              <div>
                <h1 className="vc-page-title">{t('weeklyGroceries')}</h1>
                <p className="vc-page-sub">{checkedCount} of {items.length} {t('itemsGathered')}</p>
              </div>
              <button className="vc-voice-assist-btn" onClick={() => setActiveNav('voice')}>
                <span className="material-symbols-outlined">record_voice_over</span>
                <span>{t('voiceAssist')}</span>
              </button>
            </div>

            {/* Progress bar */}
            {items.length > 0 && (
              <div className="vc-progress-bar-wrap">
                <div className="vc-progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
            )}

            {/* Bulk actions */}
            <div className="vc-bulk-actions">
              <form className="vc-add-form" onSubmit={handleManualAdd}>
                <input className="vc-add-input" value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder={t('addAnItem')} id="vc-add-input" />
                <div className="vc-add-qty-ctrl">
                  <button type="button" onClick={() => setNewItemQty(q => Math.max(1,q-1))}><span className="material-symbols-outlined">remove</span></button>
                  <span>{newItemQty}</span>
                  <button type="button" onClick={() => setNewItemQty(q => q+1)}><span className="material-symbols-outlined">add</span></button>
                </div>
                <button type="submit" className="vc-add-btn" disabled={!newItemName.trim()}>
                  <span className="material-symbols-outlined">add_shopping_cart</span> Add
                </button>
              </form>
              <div className="vc-action-chips">
                <div className="vc-search-inline">
                  <span className="material-symbols-outlined">search</span>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('searchPlaceholder')} />
                  {maxPriceFilter !== null && (
                    <span className="vc-price-badge">Under ${maxPriceFilter} <button onClick={() => setMaxPriceFilter(null)}><span className="material-symbols-outlined">close</span></button></span>
                  )}
                  {search && <button onClick={() => setSearch('')}><span className="material-symbols-outlined">close</span></button>}
                </div>
                <button className="vc-action-chip" onClick={clearList}>
                  <span className="material-symbols-outlined">delete</span> Clear
                </button>
                <button className="vc-action-chip vc-action-chip--primary" onClick={() => {
                  const text = items.map(i => `${i.checked ? '☑' : '☐'} ${i.name} (x${i.quantity})`).join('\n');
                  if (navigator.share) {
                    navigator.share({ title: 'My Grocery List', text });
                  } else {
                    navigator.clipboard.writeText(text);
                    toast('List copied to clipboard!', 'success');
                  }
                }}>
                  <span className="material-symbols-outlined">share</span> Share
                </button>
              </div>
            </div>

            {/* Items by aisle */}
            {items.length === 0 ? (
              <div className="vc-empty-full">
                <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--outline)' }}>shopping_cart</span>
                <p className="vc-empty-title">{t('emptyList')}</p>
                <p className="vc-empty-sub">Use the mic or type above to add items</p>
              </div>
            ) : (
              Object.entries(grouped).map(([cat, catItems]) => (
                <section key={cat} className="vc-aisle-section">
                  <h2 className="vc-aisle-title">
                    <span className="material-symbols-outlined">{AISLE_ICONS[cat] || 'shopping_basket'}</span>
                    {(t(`categories.${cat}`) as string) || cat}
                  </h2>
                  <div className="vc-aisle-items">
                    {catItems.map(item => {
                      const subs = getSubstitutes(item.name);
                      return (
                        <div key={item.id} className={`vc-aisle-item ${item.checked ? 'checked' : ''} ${item.checked ? '' : 'vc-aisle-item--active'}`}>
                          {item.checked && <div className="vc-aisle-item-accent" />}
                          <div className="vc-aisle-item-img">
                            <span style={{ fontSize: '2rem' }}>{CATEGORY_ICONS[item.category] || '🛒'}</span>
                          </div>
                          <div className="vc-aisle-item-body">
                            <div className="vc-aisle-item-name-row">
                              <h3 className={`vc-aisle-item-name ${item.checked ? 'strikethrough' : ''}`}>{item.name}</h3>
                              {item.price !== undefined && <span className="vc-aisle-item-price">${item.price.toFixed(2)}</span>}
                            </div>
                            <div className="vc-aisle-item-qty-row">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><span className="material-symbols-outlined">remove</span></button>
                              <span className="vc-aisle-qty-label">{item.quantity}{item.unit !== 'item' ? ` ${item.unit.toUpperCase()}` : ''}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><span className="material-symbols-outlined">add</span></button>
                            </div>
                          </div>
                          <div className="vc-aisle-item-right">
                            {subs.length > 0 && (
                              <button className={`vc-swap-btn ${expandedSubs === item.id ? 'active' : ''}`}
                                onClick={() => setExpandedSubs(expandedSubs === item.id ? null : item.id)}>
                                <span className="material-symbols-outlined">swap_horiz</span>
                              </button>
                            )}
                            <button className={`vc-check-circle ${item.checked ? 'checked' : ''}`} onClick={() => toggleCheck(item.id)}>
                              {item.checked && <span className="material-symbols-outlined" style={{ fontSize: '1rem', fontVariationSettings: "'FILL' 1" }}>check</span>}
                            </button>
                            <button className="vc-del-inline" onClick={() => removeItem(item.id)}>
                              <span className="material-symbols-outlined">close</span>
                            </button>
                          </div>
                          {expandedSubs === item.id && subs.length > 0 && (
                            <div className="vc-subs-inline">
                              <span className="vc-subs-label">Swap with:</span>
                              {subs.map(s => (
                                <button key={s} className="vc-sub-chip" onClick={() => { addItem(s); toast(`Added "${s}"`, 'success'); setExpandedSubs(null); }}>{s}</button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))
            )}
          </div>
        )}

        {/* ══ SMART SUGGESTIONS (Bento grid) ══ */}
        {activeNav === 'suggest' && (
          <div className="vc-suggest-page">
            <div className="vc-suggest-hero">
              <div className="vc-suggest-hero-row">
                <div>
                  <h1 className="vc-suggest-title">{t('smartSuggestions')}</h1>
                  <p className="vc-suggest-desc">{t('suggestDesc')}</p>
                </div>
                {dismissed.length > 0 && (
                  <button className="vc-reset-dismissed-btn" onClick={clearDismissed}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>refresh</span>
                    Reset ({dismissed.length} hidden)
                  </button>
                )}
              </div>
            </div>
            <div className="vc-bento-grid">

              {/* Low on Stock — 8 cols */}
              <section className="vc-bento-wide">
                <h2 className="vc-section-heading">
                  <span className="material-symbols-outlined" style={{ color: 'var(--error)' }}>warning</span> Low on Stock
                </h2>
                <div className="vc-stock-cards">
                  {stockSugs.length === 0 && pairingSugs.length === 0 ? (
                    <div className="vc-stock-card vc-stock-card--empty">
                      <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--outline)' }}>inventory_2</span>
                      <p>Shop regularly to see low-stock alerts</p>
                    </div>
                  ) : [...stockSugs, ...pairingSugs].slice(0, 4).map(s => (
                    <div key={s.name} className="vc-stock-card">
                      <div className="vc-stock-card-top">
                        <div className="vc-stock-thumb"><span style={{ fontSize: '2.2rem' }}>{CATEGORY_ICONS[s.category] || '🛒'}</span></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span className="vc-stock-badge">
                            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>history</span> Usually buying
                          </span>
                          <button className="vc-dismiss-btn" title="Dismiss" onClick={() => dismissSuggestion(s.name)}>
                            <span className="material-symbols-outlined">close</span>
                          </button>
                        </div>
                      </div>
                      <h3 className="vc-stock-name">{s.name}</h3>
                      <p className="vc-stock-reason">{s.reason}</p>
                      <button className="vc-stock-add-btn" onClick={() => { addItem(s.name); toast(`Added "${s.name}"`, 'success'); setActiveNav('list'); }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add_shopping_cart</span> Quick Add
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Smart Substitutes — 4 cols */}
              <section className="vc-bento-narrow">
                <h2 className="vc-section-heading">
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>swap_horiz</span> Smart Substitutes
                </h2>
                {items.length === 0 ? (
                  <div className="vc-sub-card">
                    <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.85rem', textAlign: 'center', padding: '16px 0' }}>Add items to see substitutes</p>
                  </div>
                ) : (() => {
                  const milkItem = items.find(i => i.name.toLowerCase().includes('milk'));
                  const subs = milkItem ? getSubstitutes(milkItem.name) : getSubstitutes(items[0]?.name || '');
                  const baseItem = milkItem || items[0];
                  return (
                    <div className="vc-sub-card">
                      <p className="vc-sub-card-label">Instead of {baseItem?.name}</p>
                      <h3 className="vc-sub-card-name">{subs[0] || 'No substitutes'}</h3>
                      <div className="vc-sub-card-visual">
                        <div className="vc-sub-from"><span style={{ fontSize: '2rem', opacity: 0.5 }}>{CATEGORY_ICONS[baseItem?.category || 'other'] || '🛒'}</span></div>
                        <span className="material-symbols-outlined" style={{ color: 'var(--outline)' }}>arrow_forward</span>
                        <div className="vc-sub-to"><span style={{ fontSize: '2.4rem' }}>{subs[0] ? '✨' : '❓'}</span></div>
                      </div>
                      <div className="vc-sub-card-note"><p>You've been adding more plant-based items lately.</p></div>
                      {subs.length > 0 && (
                        <div className="vc-sub-chips-row">
                          {subs.slice(0,3).map(s => (
                            <button key={s} className="vc-sub-chip-btn" onClick={() => { addItem(s); toast(`Added "${s}"`, 'success'); setActiveNav('list'); }}>{s}</button>
                          ))}
                        </div>
                      )}
                      {subs[0] && (
                        <button className="vc-sub-card-btn" onClick={() => { addItem(subs[0]); toast(`Added "${subs[0]}"`, 'success'); setActiveNav('list'); }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add_shopping_cart</span> Try Substitute
                        </button>
                      )}
                    </div>
                  );
                })()}
              </section>

              {/* Seasonal Picks — full width */}
              <section className="vc-bento-full">
                <h2 className="vc-section-heading">
                  <span className="material-symbols-outlined" style={{ color: 'var(--tertiary)' }}>eco</span> Seasonal Picks
                </h2>
                <div className="vc-seasonal-scroll">
                  {seasonalSugs.length === 0 ? (
                    <div className="vc-seasonal-card" style={{ minWidth: '200px', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: 'var(--outline)' }}>eco</span>
                      <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.82rem', textAlign: 'center' }}>Seasonal picks appear here</p>
                    </div>
                  ) : seasonalSugs.map(s => (
                    <div key={s.name} className="vc-seasonal-card">
                      <div className="vc-seasonal-img">
                        <span style={{ fontSize: '3.5rem' }}>{CATEGORY_ICONS[s.category] || '🌿'}</span>
                        <span className="vc-seasonal-badge">Peak Season</span>
                        <button className="vc-dismiss-btn vc-dismiss-btn--overlay" title="Dismiss" onClick={() => dismissSuggestion(s.name)}>
                          <span className="material-symbols-outlined">close</span>
                        </button>
                      </div>
                      <h3 className="vc-seasonal-name">{s.name}</h3>
                      <p className="vc-seasonal-sub">Fresh & in season</p>
                      <button className="vc-seasonal-add-btn" onClick={() => { addItem(s.name); toast(`Added "${s.name}"`, 'success'); setActiveNav('list'); }}>Add</button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {/* ══ SEARCH (Product Search Results) ══ */}
        {activeNav === 'search' && (
          <div className="vc-search-page">
            <div className="vc-search-bar-hero">
              <div className={`vc-search-bar-big ${voice.listening ? 'glow' : ''}`}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontVariationSettings: "'FILL' 1" }}>
                  {voice.listening ? 'mic' : 'search'}
                </span>
                <input
                  className="vc-search-big-input"
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                  placeholder="Search products… or say 'Find organic apples'"
                  autoFocus
                />
                {searchFilter && <button onClick={() => setSearchFilter('')}><span className="material-symbols-outlined">close</span></button>}
              </div>
            </div>

            <div className="vc-search-layout">
              {/* Filters sidebar */}
              <aside className="vc-filters-sidebar">
                <h3 className="vc-filters-title">
                  <span className="material-symbols-outlined">tune</span> Voice Filters
                </h3>
                <p className="vc-filters-hint">"Filter by…"</p>
                <div className="vc-filter-list">
                  {['All', 'Produce', 'Dairy', 'Bakery', 'Meat', 'Pantry', 'Beverages', 'Snacks', 'Household'].map(f => (
                    <button
                      key={f}
                      className={`vc-filter-btn ${(f === 'All' && !searchFilter) || searchFilter.toLowerCase() === f.toLowerCase() ? 'active' : ''}`}
                      onClick={() => setSearchFilter(f === 'All' ? '' : f.toLowerCase())}
                    >
                      <span>{f}</span>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                        {(f === 'All' && !searchFilter) || searchFilter.toLowerCase() === f.toLowerCase() ? 'close' : 'add'}
                      </span>
                    </button>
                  ))}
                </div>
              </aside>

              {/* Results grid */}
              <div className="vc-results-area">
                <div className="vc-results-header">
                  <h1 className="vc-results-title">Results</h1>
                  <span className="vc-results-count">{searchFiltered.length} items found</span>
                </div>

                {items.length === 0 ? (
                  <div className="vc-empty-full">
                    <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--outline)' }}>search</span>
                    <p className="vc-empty-title">{t('emptyList')}</p>
                    <p className="vc-empty-sub">Add items first, then search through them</p>
                  </div>
                ) : searchFiltered.length === 0 ? (
                  <div className="vc-empty-full">
                    <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--outline)' }}>search_off</span>
                    <p className="vc-empty-title">No results for "{searchFilter}"</p>
                    <button className="vc-add-search-result-btn" onClick={() => { addItem(searchFilter); toast(`Added "${searchFilter}"`, 'success'); setSearchFilter(''); setActiveNav('list'); }}>
                      <span className="material-symbols-outlined">add_shopping_cart</span> Add "{searchFilter}" to list
                    </button>
                  </div>
                ) : (
                  <div className="vc-results-grid">
                    {searchFiltered.map(item => (
                      <div key={item.id} className="vc-result-card">
                        <div className="vc-result-card-img">
                          <span style={{ fontSize: '3.5rem' }}>{CATEGORY_ICONS[item.category] || '🛒'}</span>
                          <span className="vc-result-badge">
                            <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>eco</span> {item.category}
                          </span>
                        </div>
                        <div className="vc-result-card-body">
                          <p className="vc-result-brand">{item.category}</p>
                          <h3 className="vc-result-name">{item.name}</h3>
                          <p className="vc-result-detail">{item.quantity} {item.unit !== 'item' ? item.unit : 'item'}</p>
                          <div className="vc-result-card-footer">
                            <div className="vc-result-qty-ctrl">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><span className="material-symbols-outlined">remove</span></button>
                              <span>{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><span className="material-symbols-outlined">add</span></button>
                            </div>
                            <button className={`vc-result-add-btn ${item.checked ? 'checked' : ''}`} onClick={() => toggleCheck(item.id)}>
                              <span className="material-symbols-outlined">{item.checked ? 'check_circle' : 'add_shopping_cart'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* HISTORY */}
        {activeNav === 'history' && (
          <div className="vc-list-page">
            <div className="vc-list-page-header">
              <div><h1 className="vc-page-title">Purchase History</h1><p className="vc-page-sub">{history.length} items</p></div>
              {history.length > 0 && (
                <button className="vc-reset-dismissed-btn" onClick={() => { clearHistory(); toast('History cleared', 'info'); }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>delete_sweep</span>
                  Clear All
                </button>
              )}
            </div>
            {history.length === 0 ? (
              <div className="vc-empty-full">
                <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--outline)' }}>history</span>
                <p className="vc-empty-title">No history yet</p>
                <p className="vc-empty-sub">Items you remove will appear here</p>
              </div>
            ) : (
              <div className="vc-aisle-items">
                {[...history].reverse().map(item => (
                  <div key={item.id} className="vc-aisle-item">
                    <div className="vc-aisle-item-img"><span style={{ fontSize: '2rem' }}>{CATEGORY_ICONS[item.category] || '🛒'}</span></div>
                    <div className="vc-aisle-item-body">
                      <h3 className="vc-aisle-item-name">{item.name}</h3>
                      <p className="vc-aisle-qty-label">{item.quantity} {item.unit !== 'item' ? item.unit : 'item'} · {item.category}</p>
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button className="vc-stock-add-btn"
                        onClick={() => { addItem(item.name, item.quantity, item.unit); toast(`Re-added "${item.name}"`, 'success'); setActiveNav('list'); }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>replay</span> Re-add
                      </button>
                      <button className="vc-del-inline" title="Remove from history" onClick={() => { removeFromHistory(item.id); toast(`Removed "${item.name}" from history`, 'info'); }}>
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SETTINGS */}
        {activeNav === 'settings' && (
          <div className="vc-list-page">
            <div className="vc-list-page-header"><h1 className="vc-page-title">Settings</h1></div>

            {/* AI CONFIGURATION CARD */}
            <div className="vc-settings-card vc-ai-settings-card">
              <div className="vc-ai-settings-header">
                <div>
                  <div className="vc-ai-title-row">
                    <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '24px' }}>auto_awesome</span>
                    <h3 className="vc-settings-label" style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>Gemini AI Smart Voice Engine</h3>
                    {hasApiKey ? (
                      <span className="vc-ai-status-badge active">⚡ Active (Gemini 3.7 Flash)</span>
                    ) : (
                      <span className="vc-ai-status-badge fallback">⚙️ Enhanced Local Fallback</span>
                    )}
                  </div>
                  <p className="vc-ai-desc">
                    Uses Gemini AI to intelligently filter background banter/noise (e.g. <em>"hhaahaa bhai tune kya"</em>), fix speech homophones (e.g. <em>"too"</em> ➔ <em>"two"</em>), and extract multiple items in compound sentences.
                  </p>
                </div>
              </div>

              <div className="vc-ai-key-section">
                <label className="vc-ai-input-label" htmlFor="gemini-api-key">Gemini API Key</label>
                <div className="vc-ai-input-row">
                  <input
                    id="gemini-api-key"
                    type={showKeyField ? 'text' : 'password'}
                    className="vc-ai-key-input"
                    placeholder="AIzaSy... (leave blank to use smart local parser)"
                    value={geminiKeyInput}
                    onChange={e => setGeminiKeyInput(e.target.value)}
                  />
                  <button
                    type="button"
                    className="vc-ai-key-toggle"
                    onClick={() => setShowKeyField(!showKeyField)}
                    title={showKeyField ? 'Hide API key' : 'Show API key'}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                      {showKeyField ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="vc-ai-key-save-btn"
                    onClick={() => {
                      setGeminiApiKey(geminiKeyInput);
                      setHasApiKey(!!geminiKeyInput.trim());
                      toast(geminiKeyInput.trim() ? 'Gemini API Key saved! AI voice parser enabled.' : 'API Key cleared. Using local parser.', 'success');
                    }}
                  >
                    Save
                  </button>
                  {hasApiKey && (
                    <button
                      type="button"
                      className="vc-ai-key-clear-btn"
                      onClick={() => {
                        setGeminiKeyInput('');
                        setGeminiApiKey('');
                        setHasApiKey(false);
                        toast('API key removed. Reverted to local parser.', 'info');
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>
                <p className="vc-ai-key-hint">
                  Get a free key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Google AI Studio</a>. Keys are stored locally in your browser.
                </p>
              </div>

              {/* Sample test buttons */}
              <div className="vc-ai-test-section">
                <p className="vc-ai-test-title">🧪 Test Smart Parsing (Simulate Spoken Commands):</p>
                <div className="vc-ai-test-chips">
                  <button
                    className="vc-ai-test-chip"
                    onClick={() => handleVoice('my doctor told me to eat only 1 cake, and he also told me to have more beetroot about 20')}
                  >
                    "my doctor told me to eat only 1 cake, and he also told me to have more beetroot about 20"
                  </button>
                  <button
                    className="vc-ai-test-chip"
                    onClick={() => handleVoice('add two apple and too water bottle hhaahaa bhai tune kya')}
                  >
                    "add two apple and too water bottle hhaahaa bhai tune kya"
                  </button>
                  <button
                    className="vc-ai-test-chip"
                    onClick={() => handleVoice('bhai do kilo aaloo aur teen packet bread add kar')}
                  >
                    "bhai do kilo aaloo aur teen packet bread add kar"
                  </button>
                  <button
                    className="vc-ai-test-chip"
                    onClick={() => handleVoice('remove milk and add 2 cartons of orange juice')}
                  >
                    "remove milk and add 2 cartons of orange juice"
                  </button>
                </div>
              </div>
            </div>

            <div className="vc-settings-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>translate</span>
                <p className="vc-settings-label" style={{ margin: 0, fontWeight: 600 }}>Automatic Universal Language Detection</p>
                <span className="vc-ai-status-badge active" style={{ marginLeft: 'auto' }}>✨ Auto Active</span>
              </div>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.86rem', margin: 0, lineHeight: 1.5 }}>
                No manual language selection needed! Simply speak in <strong>English, Hindi, Hinglish, Spanish, French, German, Japanese, Arabic, Bengali, Tamil, Telugu</strong>, or any mixed dialect. Gemini 3.7 Flash automatically identifies your language and parses your items seamlessly.
              </p>
            </div>
            <div className="vc-settings-card">
              <p className="vc-settings-label">{t('voiceRef')}</p>
              <div className="vc-cmd-table">
                {[
                  ['Multi-item Add', '"Add 2 apples and 2 water bottles"'],
                  ['Conversational / Hinglish', '"Bhai 2 kilo aaloo aur bread add kar"'],
                  ['Add item', '"Add milk" / "I need eggs"'],
                  ['With quantity', '"Add 2 bottles of water"'],
                  ['Remove', '"Remove milk" / "Take bread off my list"'],
                  ['Check off', '"Check off eggs"'],
                  ['Uncheck', '"Uncheck eggs" / "Undo milk"'],
                  ['Clear checked', '"Clear checked items"'],
                  ['Adjust qty', '"Add another milk" / "Decrease apples by 2"'],
                  ['Search / Filter', '"Find organic apples under $5"'],
                  ['Navigate', '"Go to history" / "Open settings"'],
                  ['Total cost', '"What is the total cost?" / "Budget"'],
                  ['Clear all', '"Clear the list"'],
                ].map(([cmd, ex]) => (
                  <div key={cmd} className="vc-cmd-row">
                    <span className="vc-cmd-name">{cmd}</span>
                    <span className="vc-cmd-ex">{ex}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* BOTTOM NAV */}
      <nav className="vc-bottom-nav">
        <div className="vc-bottom-nav-inner">
          <div className="vc-bottom-nav-left">
            <button className={`vc-bottom-item ${activeNav === 'voice' ? 'active' : ''}`} onClick={() => setActiveNav('voice')}>
              <span className="material-symbols-outlined" style={activeNav === 'voice' ? { fontVariationSettings: "'FILL' 1" } : {}}>home</span>
              <span>Home</span>
            </button>
            <button className={`vc-bottom-item ${activeNav === 'list' ? 'active' : ''}`} onClick={() => setActiveNav('list')}>
              <span className="material-symbols-outlined" style={activeNav === 'list' ? { fontVariationSettings: "'FILL' 1" } : {}}>list_alt</span>
              <span>Lists</span>
            </button>
          </div>
          <div className="vc-bottom-fab-wrap">
            <button className={`vc-bottom-fab ${voice.listening ? 'on' : ''}`} onClick={voice.toggle} disabled={!voice.supported}>
              <div className="vc-bottom-fab-pulse" />
              <span className="material-symbols-outlined" style={{ fontSize: '1.8rem', fontVariationSettings: "'FILL' 1", position: 'relative', zIndex: 1 }}>
                {voice.listening ? 'mic_off' : 'mic'}
              </span>
            </button>
          </div>
          <div className="vc-bottom-nav-right">
            <button className={`vc-bottom-item ${activeNav === 'suggest' ? 'active' : ''}`} onClick={() => setActiveNav('suggest')}>
              <span className="material-symbols-outlined" style={activeNav === 'suggest' ? { fontVariationSettings: "'FILL' 1" } : {}}>lightbulb</span>
              <span>Suggest</span>
            </button>
            <button className={`vc-bottom-item ${activeNav === 'settings' ? 'active' : ''}`} onClick={() => setActiveNav('settings')}>
              <span className="material-symbols-outlined" style={activeNav === 'settings' ? { fontVariationSettings: "'FILL' 1" } : {}}>settings</span>
              <span>Settings</span>
            </button>
          </div>
        </div>
      </nav>

      <ToastContainer />
    </div>
  );
}
