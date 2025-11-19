import { type Theme, ThemeContext } from "@/shared/theme"
import { type FC, type ReactNode, useCallback, useLayoutEffect, useMemo, useState } from "react"

const themeStorageKey = "getcashTheme"

const getSystemTheme = (): Theme => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

const getInitialTheme = (): Theme => {
  const stored = localStorage.getItem(themeStorageKey) as Theme | null
  return stored || getSystemTheme()
}

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  const changeTheme = useCallback((newTheme: Theme) => {
    document.documentElement.dataset.theme = newTheme
    localStorage.setItem(themeStorageKey, newTheme)
    setTheme(newTheme)
  }, [])

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme

    const handleStorage = (e: StorageEvent) => {
      if (e.key === themeStorageKey && e.newValue) {
        changeTheme(e.newValue as Theme)
      }
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem(themeStorageKey)) {
        changeTheme(e.matches ? "dark" : "light")
      }
    }

    window.addEventListener("storage", handleStorage)
    mediaQuery.addEventListener("change", handleSystemThemeChange)

    return () => {
      window.removeEventListener("storage", handleStorage)
      mediaQuery.removeEventListener("change", handleSystemThemeChange)
    }
  }, [changeTheme, theme])

  const value = useMemo(() => ({ theme, changeTheme }), [theme, changeTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
