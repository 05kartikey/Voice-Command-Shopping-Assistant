# 🛒 Voice Command Shopping Assistant (VocalCart)

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?logo=vercel)](https://voicecommand-shopping.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini%203.7%20Flash-4285F4?logo=google&logoColor=white)](https://aistudio.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

A context-aware, privacy-first AI voice shopping assistant. Powered by **React 19**, **Web Speech API**, and **Google Gemini 3.7 Flash**, it turns spoken phrases into organized supermarket shopping lists with automatic categorization, contextual quantity adjustments, ingredient pairings, and dietary substitutions.

**🔗 Live Application:** [https://voicecommand-shopping.vercel.app](https://voicecommand-shopping.vercel.app)  
**📂 GitHub Repository:** [https://github.com/05kartikey/Voice-Command-Shopping-Assistant](https://github.com/05kartikey/Voice-Command-Shopping-Assistant)

---

## 🧠 Approach & Architecture (200-Word Overview)

**VocalCart** is engineered as a privacy-centric, dual-tier voice shopping assistant built on React 19, TypeScript, and Vite. Our architecture leverages a hybrid intelligence pipeline: client-side Web Speech API captures real-time microphone audio with zero latency and automatic system language detection, while backend Vercel Serverless Functions proxy requests to Google's Gemini 3.7 Flash LLM with complete active cart context awareness.

This empowers human-grade conversational understanding—seamlessly executing multi-item additions, mid-sentence self-corrections (*"Add 5 apples, wait make it 3"*), quantity overrides (*"Doctor said eat only 1 cake"*), price filtering (*"Find toothpaste under $5"*), and noise filtration across 100+ languages and dialects. For resilience and privacy, a deterministic offline regex NLP fallback parser guarantees full functionality even without network connectivity or API keys.

Smart suggestions are driven by a dual-heuristic engine analyzing historical purchase frequencies (low-stock triggers), calendar-based seasonal harvests, culinary ingredient pairings, and dietary allergen substitutions. State is synchronized reactively via custom hooks into `localStorage`, rendering a 10-department aisle categorization with sub-second feedback, accessible micro-interactions, audio waveforms, and mobile-optimized responsiveness.

---

## ✨ Key Features

- **🎙️ Zero-Lag Voice & Conversational NLP:** Handles compound sentences, mid-phrase corrections, background banter, and phonetic homophones (*"to"* ➔ *2*).
- **🛒 Contextual Cart Understanding:** Overrides or increments existing items based on intent (*"Eat only 1 cake"* vs *"Add 2 more cakes"*).
- **🏬 10 Supermarket Aisle Departments:** Auto-categorizes into Produce, Dairy, Bakery, Meat, Pantry, Beverages, Snacks, Frozen, Household, and Personal care with rich 3D emoji product visuals.
- **💡 Smart Suggestion Bento Grid:** Low-stock frequency alerts, peak-season produce recommendations, and culinary pairing recipes.
- **🌱 Inline Dietary Substitutes:** One-tap allergy and dietary swaps (e.g., *Milk* ➔ *Oat Milk*, *Almond Milk*).
- **🔍 Voice & Price Filtering:** Real-time search by department category and budget constraints (*"Find olive oil under $10"*).
- **🔒 Private & Offline-Resilient:** 100% client storage in `localStorage` + offline regex entity extractor fallback.

---

## 🗣️ Voice Command Cheatsheet

| Action | Spoken Example | Recognized Output |
| :--- | :--- | :--- |
| **Multi-Item Add** | `"Add 2 apples and 3 bottles of olive oil"` | 2 apples (`produce`), 3 bottles olive oil (`pantry`) |
| **Conversational Override** | `"My doctor told me to eat only 1 cake and 20 beetroot"` | Sets cake to `1` (`bakery`), adds 20 beetroot (`produce`) |
| **Self-Correction** | `"Add 5 oranges, no wait make it 2"` | Adds 2 oranges (`produce`) |
| **Noise Filtering** | `"Add milk haha buddy tune kya bola"` | Adds 1 milk (`dairy`), discards background speech |
| **Price & Product Search** | `"Find toothpaste under $5"` | Filters items with query `"toothpaste"` and max price `$5.00` |
| **Remove / Clear** | `"Remove bread"`, `"Clear checked items"`, `"Clear list"` | Removes item, purges purchased, or clears list |
| **Navigation** | `"Go to suggestions"`, `"Show history"`, `"Open settings"` | Switches app tabs via voice |

---

## 🛠️ Tech Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript 6, Vite 8 | Reactive UI, concurrent rendering, strict typing |
| **Voice Engine** | Web Speech API (`SpeechRecognition`) | Native zero-latency browser speech-to-text |
| **AI Backend** | Google Gemini 3.7 Flash (Serverless) | Contextual NLP parsing via Vercel Edge Function (`/api/parse-voice`) |
| **Offline Parser** | Regex Entity & Unit Extractor | Client-side fallback parser for zero-network resilience |
| **i18n** | `i18next` + `react-i18next` | Multilingual UI and automatic voice locale detection |
| **Styling** | Vanilla CSS3 | Responsive glassmorphism design system with CSS custom properties |
| **Storage** | Browser `localStorage` | Private, persistent local cart and history state |

---

## 📁 Project Architecture

```
Voice-Command-Shopping-Assistant/
├── api/
│   └── parse-voice.ts          # Vercel Serverless Function (Gemini 3.7 Flash Backend)
├── src/
│   ├── components/
│   │   └── Toast.tsx           # Notification toast component
│   ├── hooks/
│   │   ├── useShoppingList.ts  # Core cart state, history, & localStorage synchronization
│   │   └── useVoiceRecognition.ts # Web Speech API lifecycle & audio status handler
│   ├── i18n/
│   │   └── index.ts            # Multilingual dictionaries
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces (ShoppingItem, ParsedCommand, etc.)
│   ├── utils/
│   │   ├── aiParser.ts         # Secure serverless API client dispatcher
│   │   ├── categories.ts       # Aisle department mapping & item-specific 3D emojis
│   │   ├── nlp.ts              # Deterministic offline regex entity/unit parser
│   │   ├── pricing.ts          # Mock pricing engine
│   │   ├── suggestions.ts      # Pairings, frequency alerts, and seasonal algorithms
│   │   └── toast.ts            # Toast event dispatcher
│   ├── App.css                 # Design system stylesheet
│   ├── App.tsx                 # Main application dashboard
│   └── main.tsx                # React root
├── .env.example                # Environment variable reference
└── vite.config.ts              # Vite configuration & dev proxy
```

---

## 🚀 Quickstart

### 1. Clone & Install
```bash
git clone https://github.com/05kartikey/Voice-Command-Shopping-Assistant.git
cd Voice-Command-Shopping-Assistant
npm install
```

### 2. Configure Environment (Optional for local AI)
Create a `.env` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.7-flash
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in Chrome or Edge.

### 4. Build & Lint
```bash
npm run lint
npm run build
```

---

## 🌐 Browser Support & Microphone Permissions

| Browser | Voice Recognition | Notes |
| :--- | :---: | :--- |
| **Google Chrome (Desktop & Mobile)** | ✅ Full | Native speech recognition engine |
| **Microsoft Edge** | ✅ Full | Supported via Chromium speech services |
| **Safari (iOS 14.5+ & macOS)** | ✅ Full | Requires microphone permission |
| **Mozilla Firefox** | ⚠️ Manual Input | Uses full manual keyboard input and suggestions |

> ℹ️ **Note:** The Web Speech API requires an **HTTPS** connection in production environments (supported automatically on Vercel).

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for details.
