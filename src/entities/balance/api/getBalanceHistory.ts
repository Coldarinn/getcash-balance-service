import { api } from "@/shared/api"
import { action, withAsyncData, wrap } from "@reatom/core"

import type { BalanceOpearation } from "../model"

interface getBalanceHistoryResponse {
  history: BalanceOpearation[]
}

export const getBalanceHistoryAction = action(async (userId: string) => {
  if (!userId) return

  const response = await wrap(api.get<getBalanceHistoryResponse>(`/balance/history/${userId}`))

  return response.history
}).extend(withAsyncData())
