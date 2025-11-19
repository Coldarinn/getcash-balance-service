import { api } from "@/shared/api"
import { isMockedMode } from "@/shared/utils"
import { action, withAsync, wrap } from "@reatom/core"

import type { BalanceOpearation } from "../model"
import { getBalanceHistoryAction } from "./getBalanceHistory"

interface TopUpBalanceDto {
  userId: string
  amount: string
  comment: string
}

export const topUpBalanceAction = action(async (dto: TopUpBalanceDto): Promise<BalanceOpearation> => {
  const { userId, ...body } = dto

  const response = await wrap(api.post<BalanceOpearation>(`/balance/${userId}`, { body }))

  if (isMockedMode()) {
    return {
      id: String((getBalanceHistoryAction.data() ?? []).length + 1),
      amount: Number(body.amount),
      comment: body.comment,
      type: "deposit",
      createdAt: new Date(),
    }
  }

  return response
}).extend(withAsync())
