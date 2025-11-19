export interface BalanceOpearation {
  id: string
  amount: number
  comment: string
  type: "deposit" | "withdrawal"
  createdAt: Date
}
