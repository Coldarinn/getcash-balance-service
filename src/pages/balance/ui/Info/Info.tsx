import { formatDate } from "@/shared/utils"

import { formatAmount } from "@/entities/balance"

import styles from "./Info.module.scss"

interface Props {
  amount?: number
  lastUpdated?: string | Date
}

export const Info = (props: Props) => {
  const { amount, lastUpdated } = props

  const formattedBalance = amount ? formatAmount(amount) : "-"

  let formattedDate = formatDate(lastUpdated, true)
  formattedDate = formattedDate || "-"

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Current balance</div>
      <div className={styles.balance}>{formattedBalance}</div>
      <div className={styles["last-updated"]}>Last updated: {formattedDate}</div>
    </div>
  )
}
