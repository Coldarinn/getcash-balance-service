import { Balance } from "@/pages/balance"

import { Layout } from "./Layout"
import { NotificationProvider, ThemeProvider } from "./providers"
import "./styles"

export const App = () => {
  return (
    <ThemeProvider>
      <Layout>
        <Balance />
        <NotificationProvider />
      </Layout>
    </ThemeProvider>
  )
}
