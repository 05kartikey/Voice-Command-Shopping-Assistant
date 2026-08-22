# 🛒 Voice Command Shopping Assistant

A voice-powered shopping list manager with smart suggestions, multilingual support, and a clean mobile-first UI.

**Live Demo:** [Deploy to Vercel/Netlify — see Hosting section below]

---

## Features

### 🎤 Voice Input
- **Voice Command Recognition** — Tap the mic and speak naturally
- **NLP Parsing** — Understands varied phrases:
  - `"Add milk"` / `"I need apples"` / `"Buy 2 bottles of water"`
  - `"Remove bread"` / `"Take milk off my list"`
  - `"Find organic apples"` / `"Check off eggs"`
  - `"Clear the list"`
- **Quantity + Unit extraction** — `"Add 3 kg of rice"`, `"Buy a dozen eggs"`
- **Multilingual** — English, Spanish, French, German, Hindi, Chinese (switches voice recognition language automatically)

### 💡 Smart Suggestions
- **History-based** — Items you've bought 2+ times surface as suggestions
- **Pairing-based** — Add pasta → suggests tomato sauce, parmesan
- **Seasonal** — Recommends in-season produce by current month
- **Substitutes** — Tap the tag icon on any item (milk → almond milk, oat milk, etc.)

### 📋 Shopping List Management
- Add / remove / check off items by voice or manually
- **Auto-categorization** — dairy, produce, bakery, meat, pantry, beverages, snacks, frozen, household, personal
- **Quantity controls** — +/- buttons per item
- **Persistent storage** — List and history saved to localStorage
- Duplicate detection — adding an existing item increments quantity

### 🔍 Voice-Activated Search
- Say `"Find organic apples"` or type in the search bar
- Filters by item name and category in real time

### 🎨 UI/UX
- Dark minimalist design with smooth animations
- Real-time voice transcript display while listening
- Toast notifications for every action
- Pulse animation on mic button while listening
- Mobile-optimized, touch-friendly

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Voice | Web Speech API (browser-native, free) |
| i18n | i18next + react-i18next |
| Icons | lucide-react |
| Storage | localStorage |
| Styling | Pure CSS (no framework) |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in **Chrome or Edge** (required for Web Speech API).

```bash
npm run build    # Production build → dist/
npm run preview  # Preview production build
```

---

## Hosting

### Vercel (recommended — free)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Drag & drop the dist/ folder to netlify.com/drop
```

### AWS Amplify
```bash
amplify init
amplify add hosting
amplify publish
```

> **Note:** The Web Speech API requires HTTPS in production. All platforms above provide HTTPS by default.

---

## Voice Command Reference

| Command | Example |
|---------|---------|
| Add item | `"Add milk"` / `"I need eggs"` / `"Buy bananas"` |
| Add with quantity | `"Add 2 bottles of water"` / `"Buy 3 kg of rice"` |
| Remove item | `"Remove milk"` / `"Take bread off my list"` |
| Check off | `"Check off eggs"` / `"Mark milk as done"` |
| Search | `"Find organic apples"` / `"Search for toothpaste"` |
| Clear list | `"Clear the list"` / `"Empty everything"` |

---

## Project Structure

```
src/
├── components/
│   ├── VoiceButton.tsx      # Mic button with pulse animation
│   ├── ShoppingList.tsx     # Categorized list with qty controls + substitutes
│   ├── Suggestions.tsx      # Smart suggestion cards
│   ├── SearchBar.tsx        # Real-time search
│   ├── ManualInput.tsx      # Manual add form
│   ├── LanguageSelector.tsx # Language switcher
│   └── Toast.tsx            # Notification system
├── hooks/
│   ├── useVoiceRecognition.ts  # Web Speech API wrapper
│   └── useShoppingList.ts      # List state + localStorage persistence
├── utils/
│   ├── nlp.ts               # Command parsing (add/remove/search/check/clear)
│   ├── categories.ts        # Item categorization
│   └── suggestions.ts       # History, pairing & seasonal suggestions
├── i18n/
│   └── index.ts             # 6-language translations
└── types/
    └── index.ts             # TypeScript interfaces
```

---

## Approach (200 words)

The core challenge was building a voice-first experience that feels natural without relying on paid AI APIs. I used the browser's native **Web Speech API** — zero cost, zero latency, works offline — and built a custom NLP layer on top.

The NLP parser uses regex patterns to extract intent (add/remove/check/search/clear) and then a quantity/unit extractor handles phrases like "2 bottles of water" or "a dozen eggs" including word-number mapping. The fallback treats any unrecognized phrase as an add command, so the app rarely fails silently.

Smart suggestions combine three signals: **purchase history** (items bought 2+ times), **food pairings** (add pasta → suggest sauce), and **seasonal produce** (month-aware). Substitutes are shown inline per item via a tag icon.

The architecture is deliberately simple: two custom hooks (voice + list state), pure utility functions for NLP/categorization/suggestions, and localStorage for persistence — no backend needed. This makes it instantly deployable to any static host.

The UI prioritizes the voice interaction — large mic button center-stage, real-time transcript display, immediate toast feedback — while keeping the list clean and scannable with category grouping and emoji icons.
