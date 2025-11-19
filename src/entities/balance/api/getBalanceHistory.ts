import { api } from "@/shared/api"
import { isMockedMode } from "@/shared/utils"
import { action, withAsyncData, wrap } from "@reatom/core"

import type { BalanceOpearation } from "../model"

interface getBalanceHistoryResponse {
  history: BalanceOpearation[]
}

export const getBalanceHistoryAction = action(async (userId: string): Promise<BalanceOpearation[]> => {
  if (!userId) return []

  const response = await wrap(api.get<getBalanceHistoryResponse>(`/balance/history/${userId}`))

  if (isMockedMode()) {
    return [
      {
        id: "1",
        amount: 1000,
        comment: "test",
        type: "deposit",
        createdAt: new Date(),
      },
    ]
  }

  return response.history
}).extend(withAsyncData())
