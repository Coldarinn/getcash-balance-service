import type { ReactElement } from "react"
import { toast } from "react-hot-toast"

interface NotifyOptions {
  message: string | ReactElement
  duration?: number
}

export const useNotification = () => {
  return {
    success: ({ message, duration }: NotifyOptions) => toast.success(message, { duration }),
    error: ({ message, duration }: NotifyOptions) => toast.error(message, { duration }),
    warning: ({ message, duration }: NotifyOptions) => toast(message, { duration, style: { background: "var(--color-warning)", color: "white" } }),
    info: ({ message, duration }: NotifyOptions) => toast(message, { duration, style: { background: "var(--color-info)", color: "white" } }),
  }
}
