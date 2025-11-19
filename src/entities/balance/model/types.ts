export interface BalanceOpearation {
  id: number
  amount: number
  comment: string
  type: "deposit" | "withdrawal"
  createdAt: Date
}
