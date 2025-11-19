import { useId, type InputHTMLAttributes } from "react"
import styles from "./Input.module.css"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string
  error?: string
  multiline?: boolean
}

export const Input = (props: InputProps) => {
  const { label, error, multiline = false, className = "", id, ...optherProps } = props

  const generatedId = useId()
  const inputId = id || generatedId
  const errorId = `${inputId}-error`

  const inputClass = [styles.input, error && styles.error, multiline && styles.textarea, className].filter(Boolean).join(" ")

  const InputComponent = multiline ? "textarea" : "input"

  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <InputComponent {...optherProps} id={inputId} className={inputClass} />
      {error && (
        <div id={errorId} className={styles.errorMessage}>
          {error}
        </div>
      )}
    </div>
  )
}
