import type { ApiError } from "@/shared/api"
import { mockedUserId } from "@/shared/constants"
import { useNotification } from "@/shared/hooks"
import { Loader } from "@/shared/ui"
import { reatomComponent } from "@reatom/react"
import { useEffect, useState } from "react"

import { type BalanceOpearation, getBalanceAction, getBalanceHistoryAction } from "@/entities/balance"

import styles from "./Balance.module.scss"
import { Form } from "./Form"
import { Info } from "./Info"

export const Balance = reatomComponent(() => {
  const notify = useNotification()

  const getData = async () => {
    try {
      await Promise.all([getBalanceAction(mockedUserId), getBalanceHistoryAction(mockedUserId)])
    } catch (error) {
      notify.error({ message: (error as ApiError).message })
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const isBalanceFetching = !getBalanceAction.ready()
  const isHistoryFetching = !getBalanceHistoryAction.ready()

  const isFetching = isBalanceFetching || isHistoryFetching

  const [amount, setAmount] = useState(getBalanceAction.data())
  const [history, setHistory] = useState(getBalanceHistoryAction.data() || [])

  const lastOperation = history.length ? [...history].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : undefined

  const topUpHandler = (balanceOpearation: BalanceOpearation) => {
    setHistory([balanceOpearation, ...history])
    setAmount((amount || 0) + balanceOpearation.amount)
  }

  return (
    <>
      <div className={styles.header}>
        <h1 className={styles.title}>Account Balance</h1>
        <p className={styles.subtitle}>Manage your account balance</p>
      </div>

      <div className={styles.content}>
        <Info amount={amount} lastUpdated={lastOperation?.[0].createdAt} />

        <Form onSubmit={topUpHandler} />
      </div>

      <Loader fullscreen visible={isFetching} />
    </>
  )
})
