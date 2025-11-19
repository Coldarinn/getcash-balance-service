import type { ApiError } from "@/shared/api"
import { mockedUserId } from "@/shared/constants"
import { useNotification } from "@/shared/hooks"
import { reatomComponent } from "@reatom/react"
import { type FormEvent, useState } from "react"

import { type BalanceOpearation, topUpBalanceAction } from "@/entities/balance"

import { Button } from "@/shared/ui/Button"
import { Input } from "@/shared/ui/Input"

import { commentMaxLength, minAmount, validateAmount, validateComment } from "../../model"
import styles from "./Form.module.scss"

interface Props {
  onSubmit: (balanceOpearation: BalanceOpearation) => void
}

export const Form = reatomComponent((props: Props) => {
  const { onSubmit } = props

  const notify = useNotification()

  const [amount, setAmount] = useState("100")
  const [comment, setComment] = useState("")
  const amountError = validateAmount(amount)
  const commentError = validateComment(comment)

  const isTopUpping = !topUpBalanceAction.ready()

  const isDisabled = isTopUpping || Boolean(amountError || commentError)

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault()

    if (amountError || commentError) return

    try {
      const response = await topUpBalanceAction({ amount, comment, userId: mockedUserId })
      setAmount("100")
      setComment("")
      onSubmit(response)
    } catch (error) {
      notify.error({ message: (error as ApiError).message })
    }
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} noValidate onSubmit={submitHandler}>
        <h2 className={styles.title}>Top Up Balance</h2>

        <Input
          type="number"
          label="Amount *"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min={minAmount}
          step="0.01"
          required
          placeholder="Enter amount"
          error={amountError}
        />

        <Input
          label="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          multiline
          maxLength={200}
          placeholder={`Add a comment (max ${commentMaxLength} characters)`}
          error={commentError}
        />

        <div className={styles["character-count"]}>
          {comment.length}/{commentMaxLength}
        </div>

        <Button type="submit" loading={isTopUpping} disabled={isDisabled} className={styles["submit-button"]}>
          Top Up Balance
        </Button>
      </form>
    </div>
  )
})
