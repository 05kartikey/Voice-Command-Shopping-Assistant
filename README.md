# 🛒 Voice Command Shopping Assistant

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Privacy: Zero--Telemetry](https://img.shields.io/badge/Privacy-100%25%20Local--First-brightgreen)](#-privacy-security--ethical-standards)
[![i18n](https://img.shields.io/badge/Languages-6%20Supported-blue)](#-multilingual-support)

A modern, privacy-first, voice-powered grocery shopping assistant. Built with **React 19**, **TypeScript**, and the **Web Speech API**, it turns spoken phrases into organized, categorized shopping lists with intelligent ingredient pairings, seasonal suggestions, and dietary substitutions.

**🌍 Live Demo:** [https://voice-command-shopping-assistant.vercel.app](https://voice-command-shopping-assistant.vercel.app)

---

## 📑 Table of Contents

- [🧠 Approach & Architecture (200-Word Overview)](#-approach--architecture-200-word-overview)
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [🗣️ Voice Command Cheatsheet](#️-voice-command-cheatsheet)
- [🌍 Multilingual Support](#-multilingual-support)
- [🛡️ Privacy, Security & Ethical Standards](#️-privacy-security--ethical-standards)
- [📁 Project Architecture](#-project-architecture)
- [🌐 Browser Compatibility](#-browser-compatibility)
- [🚢 Deployment Guide](#-deployment-guide)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🧠 Approach & Architecture (200-Word Overview)

**VocalCart** is engineered as a privacy-centric, dual-tier voice shopping assistant built on React 19, TypeScript, and Vite. Our architecture leverages a hybrid intelligence pipeline: client-side Web Speech API captures real-time microphone audio with zero latency and automatic system language detection, while backend Vercel Serverless Functions proxy requests to Google's Gemini 3.7 Flash LLM with complete active cart context awareness.

This empowers human-grade conversational understanding—seamlessly executing multi-item additions, mid-sentence self-corrections (*"Add 5 apples, wait make it 3"*), quantity overrides (*"Doctor said eat only 1 cake"*), price filtering (*"Find toothpaste under $5"*), and noise filtration across 100+ languages and dialects. For resilience and privacy, a deterministic offline regex NLP fallback parser guarantees full functionality even without network connectivity or API keys.

Smart suggestions are driven by a dual-heuristic engine analyzing historical purchase frequencies (low-stock triggers), calendar-based seasonal harvests, culinary ingredient pairings, and dietary allergen substitutions. State is synchronized reactively via custom hooks into `localStorage`, rendering a 10-department aisle categorization with sub-second feedback, accessible micro-interactions, audio waveforms, and mobile-optimized responsiveness.

---

## ✨ Key Features

### 🎙️ 1. Real-Time Voice Recognition & NLP Parsing
- **Zero-Latency Voice Input:** Uses the native browser Web Speech API for fast, responsive transcription.
- **Natural Language Parsing:** Recognizes actions without rigid keyword requirements:
  - *Add items:* `"Add milk"`, `"I need 3 kg of rice"`, `"Buy two dozen eggs"`
  - *Remove items:* `"Remove bread"`, `"Take apples off my list"`
  - *Check off items:* `"Check off eggs"`, `"Mark milk as done"`
  - *Search items:* `"Find organic tomatoes"`, `"Search for olive oil"`
  - *List management:* `"Clear the list"`, `"Empty everything"`
- **Quantity & Unit Extraction:** Automatically separates numbers, units (kg, liters, bottles, boxes, bags, packs, etc.), and item names.

### 💡 2. Context-Aware Smart Suggestions
- **Purchase History Frequency:** Items bought 2+ times automatically appear under "Restock Suggestions".
- **Culinary Pairings:** Adding base ingredients suggests complementary items (e.g., adding *Pasta* suggests *Tomato Sauce* and *Parmesan*).
- **Seasonal Produce:** Month-aware recommendations for fruits and vegetables in peak harvest.
- **Smart Dietary Substitutions:** Tap any item to inspect and swap with common alternatives (e.g., *Milk* ➔ *Almond Milk*, *Oat Milk*, *Soy Milk*).

### 🏬 3. Automated Aisle Categorization & Progress Tracking
- Automatically sorts items into 10+ grocery categories (Produce, Dairy, Bakery, Meat, Pantry, Beverages, Snacks, Frozen, Household, Personal).
- Visual progress bar tracking completed vs. remaining items.
- Item quantity controls (`+` / `-`), edit modal, and inline substitute swap.

### 🔒 4. Local-First & 100% Private
- All shopping lists, history, and preferences stay on your device in `localStorage`.
- No account required, no remote servers, no third-party trackers, no audio recording storage.

---

## 🛠️ Tech Stack

| Domain | Technology / Library | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) | Component architecture with modern hooks & concurrent rendering |
| **Language** | [TypeScript 6](https://www.typescriptlang.org/) | Strict type safety and clear domain models |
| **Build Tool** | [Vite 8](https://vitejs.dev/) | Instant HMR and optimized production bundling |
| **Speech Engine** | [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) | Native in-browser speech recognition |
| **Internationalization** | [i18next](https://www.i18next.com/) + [react-i18next](https://react.i18next.com/) | 6-language translation & speech locale syncing |
| **Icons** | [Lucide React](https://lucide.dev/) + Google Material Symbols | Clean, lightweight icon set |
| **Linter** | [oxlint](https://oxc.rs/) | Blazing fast JavaScript/TypeScript linter |
| **Styling** | Vanilla CSS3 | Custom responsive design system with CSS tokens & glassmorphism |
| **Persistence** | Browser `localStorage` | Offline-ready local state management |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18.0.0 or higher recommended)
- npm, pnpm, or yarn
- Modern Chromium-based browser (**Google Chrome**, **Microsoft Edge**, **Brave**) or **Safari** for Web Speech API support

### Installation & Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/05kartikey/Voice-Command-Shopping-Assistant.git
   cd Voice-Command-Shopping-Assistant
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Lint the codebase:**
   ```bash
   npm run lint
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

6. **Preview production build locally:**
   ```bash
   npm run preview
   ```

---

## 🗣️ Voice Command Cheatsheet

| Action | Spoken Example (English / Hinglish / Multilingual) | Recognized Intent |
| :--- | :--- | :--- |
| **Add Single Item** | `"Add bananas"`, `"I need butter"`, `"Ek packet bread daal do"` | Adds item to list under auto-detected category |
| **Add with Quantity & Unit** | `"Add 3 bottles of olive oil"`, `"Buy 2 kg of apples"` | Parses quantity `3`, packaging unit `bottle`, item `olive oil` |
| **Contextual Target Qty** | `"Doctor told me to eat only 1 cake and 20 beetroot"` | Sets `cake` to `1` and adds `20 beetroot` under Produce |
| **Mid-Sentence Self-Correction** | `"Add 5 apples, no wait make it 3"` | Intelligently adds only `3 apples` |
| **Noise & Banter Filtering** | `"Hey buddy add 2 milk bottles haha bhai kya kar raha hai"` | Cleanly extracts `2 bottles milk` under Dairy |
| **Item & Price Search Filter** | `"Find organic apples"`, `"Find toothpaste under $5"` | Filters catalog by query `"toothpaste"` and max price `$5.00` |
| **Remove Item** | `"Remove bread"`, `"Take milk off my list"` | Deletes matching item from list |
| **Check / Mark Done** | `"Check off eggs"`, `"Mark milk as done"` | Toggles item state to completed |
| **Voice Navigation** | `"Go to suggestions"`, `"Show history"`, `"Go to settings"` | Switches between app tabs effortlessly |
| **Clear List** | `"Clear the list"`, `"Empty everything"`, `"Clear purchased"` | Clears cart or removes checked-off items |

---

## 🌍 Multilingual Support

The assistant dynamically switches both the UI text and the Web Speech recognition language:

| Flag | Language | Code | Example Voice Phrase |
| :---: | :--- | :---: | :--- |
| 🇺🇸 | **English** | `en-US` | *"Add two cartons of almond milk"* |
| 🇪🇸 | **Spanish** | `es-ES` | *"Añadir dos botellas de leche"* |
| 🇫🇷 | **French** | `fr-FR` | *"Ajouter du pain et du fromage"* |
| 🇩🇪 | **German** | `de-DE` | *"Füge einen Liter Milch hinzu"* |
| 🇮🇳 | **Hindi** | `hi-IN` | *"दो किलो चावल जोड़ें"* |
| 🇨🇳 | **Chinese** | `zh-CN` | *"添加两瓶牛奶"* |

---

## 🛡️ Privacy, Security & Ethical Standards

This project has been built strictly adhering to ethical open-source and privacy guidelines:

1. **🔒 Zero Audio Retention & Zero Server Transmission**
   - Voice input is processed exclusively through the browser's native client-side speech API.
   - Audio is **never recorded, stored on a remote server, or used for biometric profiling**.
2. **🏠 100% Local Data Ownership**
   - All shopping lists, historical item frequencies, and dismissed suggestions are stored strictly in client-side `localStorage`.
   - Clearing your browser cache removes all application data.
3. **🚫 No Trackers, No Analytics & No Ads**
   - The application contains **zero third-party tracking scripts, cookie beacons, or telemetry SDKs**.
4. **♿ Inclusivity & Accessibility (Dual-Modality)**
   - Voice interaction is completely mirrored by manual text input, touch buttons, and keyboard navigation. Users who are non-verbal, hard of hearing, or in quiet/loud environments have full access to all features.
5. **🥗 Transparent Recommendations & Medical Disclaimer**
   - Suggestions (seasonality, pairings, substitutes) are deterministic and transparently labeled.
   - *Disclaimer:* Suggested food substitutes are for general culinary inspiration and do not replace professional medical or allergen advice.

---

## 📁 Project Architecture

```
Voice-Command-Shopping-Assistant/
├── public/
│   └── cart.svg                # Brand icon
├── src/
│   ├── components/
│   │   └── Toast.tsx            # Accessible notification toast container
│   ├── hooks/
│   │   ├── useShoppingList.ts   # Core list state + localStorage sync
│   │   └── useVoiceRecognition.ts # Web Speech API wrapper & lifecycle handler
│   ├── i18n/
│   │   └── index.ts             # Internationalization dictionaries
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces & types
│   ├── utils/
│   │   ├── categories.ts        # Item classification & aisle mappings
│   │   ├── nlp.ts               # Intent, entity, quantity & unit parser
│   │   ├── pricing.ts           # Deterministic mock pricing engine
│   │   ├── suggestions.ts       # Pairing, frequency, & seasonal algorithms
│   │   └── toast.ts             # Decoupled toast event emitter
│   ├── App.css                  # Custom responsive design system
│   ├── App.tsx                  # Main application orchestrator & dashboard
│   └── main.tsx                 # React DOM root entry point
├── .gitignore                   # Comprehensive rule set for safe commits
├── .oxlintrc.json               # Fast linter configuration
├── LICENSE                      # MIT Open Source License
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript project config
└── vite.config.ts               # Vite build settings
```

---

## 🌐 Browser Compatibility

| Browser | Voice Recognition Support | Notes |
| :--- | :---: | :--- |
| **Google Chrome (Desktop & Android)** | ✅ Full | Best performance with native speech engine |
| **Microsoft Edge** | ✅ Full | Supported via Chromium speech services |
| **Brave** | ⚠️ Setting Required | Enable *Speech Recognition* in Brave privacy settings |
| **Safari (iOS & macOS)** | ✅ Partial / Full | Requires iOS 14.5+ / macOS 11+ |
| **Mozilla Firefox** | ❌ Manual Input Only | Web Speech API recognition not yet enabled by default; use manual input |

> ⚠️ **Important:** In production environments, the Web Speech API strictly requires **HTTPS** for microphone access. `localhost` is supported over HTTP for local testing.

---

## 🚢 Deployment Guide

The app is completely static and can be deployed in seconds with zero backend dependencies:

### Deploying to Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Deploying to Netlify
```bash
npm run build
# Drag and drop the dist/ folder to https://app.netlify.com/drop
```

### Deploying to GitHub Pages
1. Install `gh-pages`:
   ```bash
   npm install --save-dev gh-pages
   ```
2. Add `base: './'` in `vite.config.ts`.
3. Add deploy script to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
4. Run `npm run deploy`.

---

## 🤝 Contributing

Contributions are warmly welcomed! If you'd like to help improve the project:

1. **Fork** the repository.
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes:**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
4. **Push to branch:**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**.

Please ensure your code passes `npm run lint` and `npm run build` before submitting.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for full details.

---

<div align="center">
  <sub>Built with ❤️ for privacy, accessibility, and effortless grocery shopping.</sub>
</div>
