require('dotenv').config()
require('./src/bot')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const { testConnection, getBudgets, getAccounts } = require('./src/ynab')

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'YNAB/Telegram bot is running' })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

async function initializeYNAB () {
  const connected = await testConnection()
  if (connected) {
    const budgets = await getBudgets()
    if (budgets.length > 0) {
      const firstBudget = budgets[0]
      await getAccounts(firstBudget.id)
    }
  }
}

initializeYNAB()
