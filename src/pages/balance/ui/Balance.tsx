import styles from "./Balance.module.css"
import { Form } from "./Form"
import { Info } from "./Info"

export const Balance = () => {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Account Balance</h1>
        <p className={styles.subtitle}>Manage your account balance</p>
      </header>

      <main className={styles.main}>
        <Info />

        <Form />
      </main>
    </div>
  )
}
