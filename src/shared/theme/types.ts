export type Theme = "light" | "dark"

export interface ThemeContextType {
  theme: Theme
  changeTheme: (theme: Theme) => void
}
