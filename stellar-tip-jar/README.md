# ⭐ Stellar Tip Jar

A production-ready Stellar dApp for sending XLM tips on the Stellar Testnet, built with vanilla JavaScript, Vite, and Freighter wallet.

![Stellar Tip Jar](./screenshots/preview.png)

---

## ✨ Features

- 🔐 **Freighter wallet** detection, connect & disconnect
- 💰 **Live XLM balance** fetched from Stellar Horizon Testnet
- 💸 **Send XLM** payments with real transaction signing
- ✅ **Transaction feedback** — hash on success, clear error messages on failure
- 🌑 **Modern dark UI** with amber accent, responsive layout
- 🧱 **Modular architecture** — wallet / services / ui / utils
- ⚙️ **Vite** dev server + build pipeline
- 🧹 **ESLint + Prettier** code quality tooling

---

## 🗂 Project Structure

```
stellar-tip-jar/
├── index.html              # App shell
├── vite.config.js          # Vite configuration
├── package.json
├── .eslintrc.json          # ESLint rules
├── .prettierrc             # Prettier config
├── .gitignore
│
├── src/
│   ├── main.js             # App controller — wires all modules
│   ├── wallet/
│   │   └── wallet.js       # Freighter detect / connect / sign
│   ├── services/
│   │   ├── balance.js      # Fetch XLM balance via Horizon
│   │   └── transaction.js  # Build / sign / submit transactions
│   ├── ui/
│   │   └── ui.js           # All DOM updates & event binding
│   └── utils/
│       └── helpers.js      # Shared utilities (format, validate, etc.)
│
├── styles/
│   └── style.css           # Dark theme with CSS custom properties
│
├── assets/
│   └── logo.svg            # App logo
│
└── screenshots/
    └── preview.png
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and npm
- **Freighter** browser extension → [freighter.app](https://freighter.app)
- Freighter set to **Testnet** network

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/stellar-tip-jar.git
cd stellar-tip-jar

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The app opens at `http://localhost:5173`.

### Build for production

```bash
npm run build      # outputs to /dist
npm run preview    # preview the production build locally
```

### Code quality

```bash
npm run lint       # check for ESLint issues
npm run lint:fix   # auto-fix ESLint issues
npm run format     # format with Prettier
```

---

## 🧪 Testing on Testnet

1. Install the [Freighter extension](https://freighter.app) and create a wallet
2. Switch Freighter to **Testnet**
3. Fund your account with the [Stellar Friendbot](https://friendbot.stellar.org/?addr=YOUR_G_ADDRESS)
4. Open the dApp and connect your wallet

---

## 🏗 Architecture

| Module | Responsibility |
|---|---|
| `main.js` | App controller — orchestrates all modules, no DOM access |
| `wallet/wallet.js` | Freighter detection, connection, signing |
| `services/balance.js` | XLM balance fetch via Horizon REST API |
| `services/transaction.js` | Transaction build, sign, submit, error parsing |
| `ui/ui.js` | All DOM reads and writes, event binding |
| `utils/helpers.js` | Address truncation, XLM formatting, validation |

---

## 📸 Screenshots

> _Add screenshots to `/screenshots` after running the app._

---

## 🔗 Live Demo

> _Add your deployed URL here_

---

## 🛠 Tech Stack

- **HTML5** — semantic markup
- **CSS3** — custom properties, grid, responsive
- **JavaScript ES Modules** — no frameworks
- **[Vite](https://vitejs.dev)** — dev server & bundler
- **[Stellar SDK](https://github.com/stellar/js-stellar-sdk)** — transaction building
- **[Freighter API](https://freighter.app/docs)** — wallet signing
- **[ESLint](https://eslint.org)** + **[Prettier](https://prettier.io)** — code quality

---

## 📄 License

MIT
