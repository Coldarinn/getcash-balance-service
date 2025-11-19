export const minAmount = 100
export const validateAmount = (amount: string) => (!amount || parseFloat(amount) < minAmount ? `Minimum amount is ${minAmount}` : undefined)

export const commentMaxLength = 200
export const validateComment = (comment: string) => (comment.length > 200 ? `Comment must not exceed ${commentMaxLength} characters` : undefined)
