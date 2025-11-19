import { Input } from "@/shared/ui/Input"
import styles from "./Form.module.css"
import { useState, type FormEvent } from "react"
import { Button } from "@/shared/ui/Button"

export const Form = () => {
  const [isLoading, setIsLoading] = useState(false)

  const [amount, setAmount] = useState("")
  const [comment, setComment] = useState("")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))
    } finally {
      setIsLoading(false)
    }
  }

  const inputError = amount && parseFloat(amount) < minAmount ? `Minimum amount is ${minAmount}` : undefined

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>Top Up Balance</h2>

        <Input
          type="number"
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min={minAmount}
          step="0.01"
          required
          placeholder="Enter amount"
          error={inputError}
        />

        <Input
          label="Comment (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          multiline
          maxLength={200}
          placeholder={`Add a comment (max ${commentMaxLength} characters)`}
          error={comment.length > 200 ? `Comment must not exceed ${commentMaxLength} characters` : undefined}
        />

        <div className={styles.characterCount}>
          {comment.length}/{commentMaxLength}
        </div>

        <Button type="submit" loading={isLoading} disabled={isLoading} className={styles.submitButton}>
          Top Up Balance
        </Button>
      </form>
    </div>
  )
}

const commentMaxLength = 200
const minAmount = 1
