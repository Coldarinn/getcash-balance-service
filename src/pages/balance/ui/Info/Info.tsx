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
  const formattedDate = formatDate(lastUpdated, true) || "-"

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Current balance</div>

      <div className={styles.balance}>{formattedBalance}</div>

      <div className={styles["last-updated"]}>
        Last updated: <time dateTime={lastUpdated?.toString()}>{formattedDate}</time>
      </div>
    </div>
  )
}
