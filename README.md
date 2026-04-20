# YNAB Telegram Expense Tracker

A Telegram bot that automatically adds expenses to your **YNAB (You Need A Budget)** account by parsing text messages.

---

## ✨ Features

- 💬 **Send expenses via Telegram** — e.g. `Starbucks - coffee - 5.50`
- 🏦 **Automatic account selection** — e.g. `McDonald's - lunch - 12.75 - credit`
- 🔄 **Real-time transaction creation** in YNAB
- ✅ **Input validation** and error handling
- 🎯 **Support for multiple accounts**

---

## 🎬 Demo

```text
You: Starbucks - coffee - 5.50

Bot: ✅ Transaction added successfully!
     💳 Payee:   Starbucks
     📝 Memo:    coffee
     💰 Amount:  $5.50
     🏦 Account: Principal
```

---

## 📋 Prerequisites

- **Node.js** 16+ installed
- **YNAB account** with API access
- **Telegram account**

---

## 🚀 Setup

### 1. Clone the repository

```bash
git clone https://github.com/Rhplx/YNAB-parse-tracker.git
cd YNAB-parse-tracker
npm install
```

### 2. Create a Telegram Bot

1. Open Telegram and search for [`@BotFather`](https://t.me/BotFather)
2. Send `/newbot` and follow the instructions
3. Save your **bot token**

### 3. Get YNAB API Token

1. Go to [YNAB Developer Settings](https://app.ynab.com/settings/developer)
2. Generate a new **Personal Access Token**
3. Save your token

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Telegram & Server
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
YNAB_ACCESS_TOKEN=your_ynab_access_token_here
PORT=3000

# YNAB Configuration (get these from the startup logs)
YNAB_PLAN_ID=your_plan_id_here
YNAB_DEFAULT_ACCOUNT_ID=your_default_account_id_here
YNAB_DEFAULT_ACCOUNT_NAME=Principal
```

### 5. Find Your YNAB IDs

Run the bot in development mode:

```bash
npm run dev
```

Look at the startup logs to find your **Plan ID** and **Account IDs**, then update your `.env` file accordingly.

### 6. Start the Bot

```bash
npm start
```

---

## 💡 Usage

### Basic Format

```text
payee - memo - amount
```

### With Account Selection

```text
payee - memo - amount - account
```

### Examples

| Message | Behavior |
| --- | --- |
| `Starbucks - coffee - 5.50` | Uses default account |
| `Walmart - groceries - 45.30 - credit` | Uses credit card account |
| `Shell - gas - 60.00 - checking` | Uses checking account |

---

## 📄 License

**MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🤝 Support

- 🐛 [Report Issues](https://github.com/Rhplx/YNAB-parse-tracker/issues)
- 💡 [Request Features](https://github.com/Rhplx/YNAB-parse-tracker/issues/new)
- ⭐ Star this repo if it helps you!

---

## ⚠️ Disclaimer

This is an **unofficial tool**. YNAB is a trademark of You Need A Budget LLC.
