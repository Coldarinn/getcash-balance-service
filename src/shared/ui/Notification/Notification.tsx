import { useEffect } from "react"
import styles from "./Notification.module.css"

export type NotificationType = "success" | "error" | "warning" | "info"

export interface NotificationProps {
  type: NotificationType
  message: string
  onClose: () => void
  autoHide?: boolean
  duration?: number
}

export const Notification = (props: NotificationProps) => {
  const { type, message, onClose, autoHide = true, duration = 5000 } = props

  const notificationClass = [styles.notification, styles[type]].join(" ")

  useEffect(() => {
    if (!autoHide) return

    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [autoHide, duration, onClose])

  return (
    <div className={notificationClass}>
      <div className={styles.content}>
        <span className={styles.message}>{message}</span>
        <button className={styles.closeButton} onClick={onClose}>
          x
        </button>
      </div>
    </div>
  )
}
