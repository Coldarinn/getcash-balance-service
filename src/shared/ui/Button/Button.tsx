import type { ButtonHTMLAttributes } from "react"
import styles from "./Button.module.css"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline"
  size?: "small" | "medium" | "large"
  loading?: boolean
}

export const Button = (props: ButtonProps) => {
  const { children, variant = "primary", size = "medium", loading = false, disabled, className = "", ...otherProps } = props

  const buttonClass = [styles.button, styles[variant], styles[size], loading && styles.loading, className].filter(Boolean).join(" ")

  return (
    <button {...otherProps} className={buttonClass} disabled={disabled || loading}>
      {loading && <span className={styles.spinner} />}
      <span className={styles.content}>{children}</span>
    </button>
  )
}
