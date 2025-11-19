import { Balance } from "@/pages/balance"

import { NotificationProvider } from "./providers"
import "./styles"

export const App = () => {
  return (
    <>
      <Balance />
      <NotificationProvider />
    </>
  )
}
