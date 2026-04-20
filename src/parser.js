function parseExpenseMessage (message) {
  try {
    const parts = message.trim().split('-').map(part => part.trim())

    console.log('🔍 Debug - Parts after split:', parts)
    console.log('🔍 Debug - Number of parts:', parts.length)

    if (parts.length !== 3) {
      return {
        success: false,
        error: 'Please use format: payee - memo - amount'
      }
    }

    const [payee, memo, amountStr] = parts

    if (!payee || payee.length === 0) {
      return {
        succes: false,
        error: 'Payee cannot be empty'
      }
    }

    const amount = parseFloat(amountStr)

    if (isNaN(amount) || amount <= 0) {
      return {
        success: false,
        error: 'Amount must be a valid positive number'
      }
    }

    const ynabAmount = Math.round(amount * -1000)

    console.log('🔍 Parser Debug - About to return success! ', ynabAmount)

    return {
      success: true,
      data: {
        payee,
        memo: memo || '',
        amount: ynabAmount,
        originalAmount: amount
      }
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to parse message: ' + error.message
    }
  }
}

module.exports = {
  parseExpenseMessage
}
