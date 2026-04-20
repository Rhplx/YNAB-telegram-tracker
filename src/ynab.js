const ynab = require('ynab')

const ynabAPI = new ynab.API(process.env.YNAB_ACCESS_TOKEN)

async function testConnection () {
  try {
    const userResponse = await ynabAPI.user.getUser()
    console.log('user ID: ', userResponse.data.user.id)
    return true
  } catch (error) {
    console.log('Error message:', error.message)
    console.log('Error status:', error.status)
    console.log('Full error:', error)
    return false
  }
}

async function getBudgets () {
  try {
    const budgetsResponse = await ynabAPI.plans.getPlans()
    const budgets = budgetsResponse.data.plans

    console.log('📊 Found', budgets.length, 'budget(s):')
    budgets.forEach(budget => {
      console.log(`  - ${budget.name} (ID: ${budget.id})`)
    })

    return budgets
  } catch (error) {
    console.log('❌ Failed to get budgets:', error.message)
    return []
  }
}

async function getAccounts (budgetId) {
  try {
    console.log('Getting accounts for budget:', budgetId)
    const accountsResponse = await ynabAPI.accounts.getAccounts(budgetId)
    const accounts = accountsResponse.data.accounts

    console.log('💳 Found', accounts.length, 'account(s):')
    accounts.forEach(account => {
      if (!account.closed) {
        console.log(`  - ${account.name} (${account.type}) - Balance: $${account.balance / 1000} - ID: ${account.id}`)
      }
    })

    return accounts.filter(account => !account.closed)
  } catch (error) {
    console.log('❌ Failed to get accounts:', error.message)
    return []
  }
}

async function addTransaction (planId, accountId, payee, memo, amount) {
  try {
    console.log('💰 Adding transaction to YNAB...')
    console.log(`  Plan: ${planId}`)
    console.log(`  Account: ${accountId}`)
    console.log(`  Payee: ${payee}`)
    console.log(`  Memo: ${memo}`)
    console.log(`  Amount: ${amount} milliunits`)

    const transaction = {
      account_id: accountId,
      payee_name: payee,
      memo,
      amount,
      date: new Date().toISOString().split('T')[0],
      cleared: 'uncleared'
    }

    const response = await ynabAPI.transactions.createTransaction(planId, { transaction })

    console.log('✅ Transaction added successfully!')
    console.log('Transaction ID:', response.data.transaction.id)

    return {
      success: true,
      transaction: response.data.transaction
    }
  } catch (error) {
    console.log('❌ Failed to add transaction:', error.message)
    return {
      success: false,
      error: error.message
    }
  }
}

async function findAccountByName (planId, accountName) {
  try {
    const accounts = await getAccounts(planId)
    const account = accounts.find(acc => acc.name.toLowerCase().includes(accountName.toLowerCase()))
    if (account) {
      console.log(`✅ Found account: ${account.name} (ID: ${account.id})`)
      return account
    } else {
      console.log(`❌ Account not found: ${accountName}`)
      return null
    }
  } catch (error) {
    console.log('❌ Error finding account:', error.message)
    return null
  }
}

module.exports = {
  ynabAPI,
  testConnection,
  getBudgets,
  getAccounts,
  addTransaction,
  findAccountByName
}
