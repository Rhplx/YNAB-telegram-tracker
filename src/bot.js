const TelegramBot = require('node-telegram-bot-api')
const { parseExpenseMessage } = require('./parser')
const { addTransaction, findAccountByName } = require('./ynab')

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true })

// Add debugging
bot.on('polling_error', (error) => {
  console.log('❌ Polling error:', error.message)
})

bot.on('error', (error) => {
  console.log('❌ Bot error:', error.message)
})

console.log('🤖 Telegram bot is starting...')
console.log('Bot token exists:', !!process.env.TELEGRAM_BOT_TOKEN)

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id
  const welcomeMessage = `
  🤖 Welcome to YNAB Expense Bot!

Send me expenses in this format:
📝 payee - memo - amount - account (optional)

Examples:
• psychologist - session - 500
• Uber - Uber to Axolotl - 250
• Uber Eats - Callejeras - 60.00

I'll add them to your YNAB account automatically!
If no account is specified, I'll use Principal by default!
  `
  bot.sendMessage(chatId, welcomeMessage)
})

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id
  const helpMessage = `
📋 How to use:

Format: payee - memo - amount - [account]
• payee: Where you spent money
• memo: What you bought
• amount: How much you spent
• account: Which account to use (optional)

Examples:
✅ Starbucks - coffee - 5.50 (uses Principal)
✅ Walmart - groceries - 45.30 - credit
✅ Shell - gas - 60.00 - nu
✅ McDonald's - lunch - 12.75 - savings

Available accounts:
• Principal (or "principal", "cash")
• NU (or "nu", "credit")
• Savings (or "savings")
  `

  bot.sendMessage(chatId, helpMessage)
})

bot.on('message', async (msg) => {
  if (msg.text && msg.text.startsWith('/')) {
    return null
  }
  const chatId = msg.chat.id
  const messageText = msg.text

  console.log('received message:', messageText)
  console.log('🔍 Bot Debug - Message includes dash:', messageText.includes('-'))
  console.log('🔍 Bot Debug - Message length:', messageText.length)

  if (!messageText.includes('-')) {
    console.log('Please use a right format payee - memo - amount')
    return null
  }

  const parseResult = parseExpenseMessage(messageText)
  console.log('🔍 Bot Debug - Parse result:', parseResult)

  if (!parseResult.success) {
    console.log('🔍 Bot Debug - Parser failed, sending error')
  // Send error message to user
  // ...
  } else {
    console.log('🔍 Bot Debug - Parser succeeded!')
  // Success! Show parsed data
  // ...
  }

  if (!parseResult.success) {
    // Send error message to user
    bot.sendMessage(chatId, `❌ ${parseResult.error}
Please use: payee - memo - amount
Example: Starbucks - coffee - 5.50`)
    return null
  }
  const { payee, memo, originalAmount, amount, accountName } = parseResult.data

  const accountText = accountName ? ` to ${accountName}` : ' to Principal (default)'

  const successMessage = `✅ Parsed successfully!
  
💳 Payee: ${payee}
📝 Memo: ${memo}
💰 Amount: $${originalAmount},
🔄 Adding${accountText}...


Adding to YNAB`

  bot.sendMessage(chatId, successMessage)

  const planId = '71b3970b-d8cc-4dba-b220-b1ff15b4b854'
  let accountId
  let finalAccountName

  if (accountName) {
    // User specified an account - find it
    const account = await findAccountByName(planId, accountName)

    if (!account) {
      bot.sendMessage(chatId, `❌ Account "${accountName}" not found!
      
Available accounts:
• Principal (cash)
• NU (credit card)
• Savings
• Informal debts

Try: ${payee} - ${memo} - ${originalAmount} - principal`)
      return null
    }
    accountId = account.id
    finalAccountName = account.name
  } else {
    accountId = '911b8e62-3628-4134-a3d2-daeabe26357e'
    finalAccountName = 'Principal'
  }

  const result = await addTransaction(planId, accountId, payee, memo, amount)

  if (result.success) {
    bot.sendMessage(chatId, `🎉 Transaction added successfully!
    
💳 ${payee}
📝 ${memo}
💰 $${originalAmount}
📅 ${new Date().toLocaleDateString()}
🏦 Account: ${finalAccountName}
`)
  } else {
    bot.sendMessage(chatId, `❌ Failed to add transaction: ${result.error}`)
  }
})

console.log('🤖 Telegram bot is running...')

module.exports = bot
