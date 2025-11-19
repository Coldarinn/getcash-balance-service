import { api } from "@/shared/api"
import { action, withAsyncData, wrap } from "@reatom/core"

interface GetBalanceResponse {
  amount: number
}

export const getBalanceAction = action(async (userId: string) => {
  const response = await wrap(api.get<GetBalanceResponse>(`/balance/${userId}`))

  return response.amount
}).extend(withAsyncData())
