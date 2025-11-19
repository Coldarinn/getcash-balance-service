import styles from "./Info.module.scss"

function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}

export const Info = () => {
  const formattedBalance = formatCurrency(1000)
  const formattedDate = new Date("2023-01-01").toLocaleDateString()

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Current balance</div>
      <div className={styles.balance}>{formattedBalance}</div>
      <div className={styles["last-updated"]}>Last updated: {formattedDate}</div>
    </div>
  )
}
