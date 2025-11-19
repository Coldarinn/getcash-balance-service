import styles from "./Info.module.css"

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
    <div className={styles.card}>
      <div className={styles.label}>Current balance</div>
      <div className={styles.amount}>{formattedBalance}</div>
      <div className={styles.lastUpdated}>Last updated: {formattedDate}</div>
    </div>
  )
}
