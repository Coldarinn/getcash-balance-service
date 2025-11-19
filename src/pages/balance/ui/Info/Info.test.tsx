import * as dateUtils from "@/shared/utils"
import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import * as balanceUtils from "@/entities/balance"

import { Info } from "./Info"

describe("Balance Info", () => {
  const MOCK_AMOUNT = 1000
  const MOCK_AMOUNT_FORMATTED = "$1,000.00"
  const MOCK_DATE = new Date("2025-11-19T12:00:00Z")
  const MOCK_DATE_FORMATTED = "19.11.2025 00:00"

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it("renders correctly with amount and lastUpdated", () => {
    vi.spyOn(balanceUtils, "formatAmount").mockReturnValue(MOCK_AMOUNT_FORMATTED)
    vi.spyOn(dateUtils, "formatDate").mockReturnValue(MOCK_DATE_FORMATTED)

    render(<Info amount={MOCK_AMOUNT} lastUpdated={MOCK_DATE} />)

    expect(screen.getByText("Current balance")).toBeInTheDocument()
    expect(screen.getByText(MOCK_AMOUNT_FORMATTED)).toBeInTheDocument()
    expect(screen.getByText("Last updated:")).toBeInTheDocument()
    expect(screen.getByText(MOCK_DATE_FORMATTED)).toBeInTheDocument()

    const time = screen.getByText(MOCK_DATE_FORMATTED).closest("time")
    expect(time).toHaveAttribute("dateTime", MOCK_DATE.toString())
  })

  it("renders fallback when amount is missing", () => {
    vi.spyOn(dateUtils, "formatDate").mockReturnValue(MOCK_DATE_FORMATTED)

    render(<Info lastUpdated={MOCK_DATE} />)

    expect(screen.getByText("-")).toBeInTheDocument()
  })

  it("renders fallback when lastUpdated is missing", () => {
    vi.spyOn(balanceUtils, "formatAmount").mockReturnValue(MOCK_AMOUNT_FORMATTED)

    render(<Info amount={MOCK_AMOUNT} />)

    expect(screen.getByText("-")).toBeInTheDocument()
  })

  it("handles string date correctly", () => {
    vi.spyOn(balanceUtils, "formatAmount").mockReturnValue(MOCK_AMOUNT_FORMATTED)
    vi.spyOn(dateUtils, "formatDate").mockReturnValue(MOCK_DATE_FORMATTED)

    const dateStr = "2025-11-19T12:00:00Z"
    render(<Info amount={MOCK_AMOUNT} lastUpdated={dateStr} />)

    const time = screen.getByText(MOCK_DATE_FORMATTED).closest("time")
    expect(time).toHaveAttribute("dateTime", dateStr)
  })

  it("falls back to '-' if formatDate returns falsy", () => {
    vi.spyOn(balanceUtils, "formatAmount").mockReturnValue(MOCK_AMOUNT_FORMATTED)
    vi.spyOn(dateUtils, "formatDate").mockReturnValue("")

    render(<Info amount={MOCK_AMOUNT} lastUpdated={MOCK_DATE} />)

    expect(screen.getByText("-")).toBeInTheDocument()
  })
})
