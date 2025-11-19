import { api } from "@/shared/api"
import { isMockedMode } from "@/shared/utils"
import { action, withAsyncData, wrap } from "@reatom/core"

interface GetBalanceResponse {
  amount: number
}

export const getBalanceAction = action(async (userId: string): Promise<number | undefined> => {
  if (!userId) return

  const response = await wrap(api.get<GetBalanceResponse>(`/balance/${userId}`))

  if (isMockedMode()) {
    return 1000
  }

  return response.amount
}).extend(withAsyncData())
