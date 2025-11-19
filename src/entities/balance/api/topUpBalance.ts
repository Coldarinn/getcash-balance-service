import { api } from "@/shared/api"
import { action, withAsync, wrap } from "@reatom/core"

import type { BalanceOpearation } from "../model"

interface TopUpBalanceDto {
  userId: string
  amount: string
  comment: string
}

export const topUpBalanceAction = action(async (dto: TopUpBalanceDto) => {
  const { userId, ...body } = dto

  const response = await wrap(api.post<BalanceOpearation>(`/balance/${userId}`, { body }))

  return response
}).extend(withAsync())
