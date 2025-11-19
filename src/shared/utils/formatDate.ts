import { format, isValid, parseISO } from "date-fns"

export const formatDate = (input: string | Date | null | undefined, withTime: boolean = false): string => {
  if (!input) return ""

  let date: Date

  if (input instanceof Date) {
    if (!isValid(input)) return ""
    date = input
  } else if (typeof input === "string") {
    const parsed = parseISO(input)
    if (!isValid(parsed)) return ""
    date = parsed
  } else {
    return ""
  }

  return format(date, withTime ? "dd.MM.yyyy HH:mm" : "dd.MM.yyyy")
}
