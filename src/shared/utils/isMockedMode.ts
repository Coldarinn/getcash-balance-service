import { atom, withLocalStorage } from "@reatom/core"

export const isMockedModeStorageKey = "getcashIsMockedMode"
export const isMockedMode = atom(false).extend(withLocalStorage(isMockedModeStorageKey))
