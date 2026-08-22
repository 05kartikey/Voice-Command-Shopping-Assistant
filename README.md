# 🛒 Voice Command Shopping Assistant

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Privacy: Zero--Telemetry](https://img.shields.io/badge/Privacy-100%25%20Local--First-brightgreen)](#-privacy-security--ethical-standards)
[![i18n](https://img.shields.io/badge/Languages-6%20Supported-blue)](#-multilingual-support)

A modern, privacy-first, voice-powered grocery shopping assistant. Built with **React 19**, **TypeScript**, and the **Web Speech API**, it turns spoken phrases into organized, categorized shopping lists with intelligent ingredient pairings, seasonal suggestions, and dietary substitutions.

---

## 📑 Table of Contents

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

| Action | Spoken Example (English) | Recognized Intent |
| :--- | :--- | :--- |
| **Add Single Item** | `"Add bananas"`, `"I need butter"` | Adds item to list under auto-detected category |
| **Add with Quantity** | `"Add 3 bottles of water"`, `"Buy 2 kg of apples"` | Parses quantity `3`, unit `bottles`, name `water` |
| **Remove Item** | `"Remove bread"`, `"Take milk off my list"` | Deletes matching item from list |
| **Check / Mark Done** | `"Check off eggs"`, `"Mark milk as done"` | Toggles item state to completed |
| **Search Filter** | `"Find organic apples"`, `"Search for olive oil"` | Switches to Search tab and filters list |
| **Clear All** | `"Clear the list"`, `"Empty everything"` | Resets the current shopping list |

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
│   ├── favicon.svg             # App favicon
│   ├── cart.svg                # Brand icon
│   └── icons.svg               # SVG sprite definitions
├── src/
│   ├── assets/                 # Static images & artwork
│   ├── components/
│   │   ├── LanguageSelector.tsx # 6-language switcher
│   │   ├── ManualInput.tsx      # Fallback form for manual item entry
│   │   ├── SearchBar.tsx        # Real-time list search bar
│   │   ├── ShoppingList.tsx     # Categorized list view with quantity controls
│   │   ├── Suggestions.tsx      # Suggestion cards (frequency, pairings, seasonal)
│   │   ├── Toast.tsx            # Accessible notification toast container
│   │   └── VoiceButton.tsx      # Pulse mic button with live audio visualizer
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
│   │   ├── suggestions.ts       # Pairing, frequency, & seasonal algorithms
│   │   └── toast.ts             # Decoupled toast event emitter
│   ├── App.css                  # Custom responsive design system
│   ├── App.tsx                  # Main application orchestrator & dashboard
│   ├── index.css                # Global CSS resets & root tokens
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
