import { mockedUserId } from "@/shared/constants"
import * as hooksModule from "@/shared/hooks"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import * as balanceModule from "@/entities/balance"

import { Form } from "./Form"

describe("Balance Form", () => {
  const MOCK_RESPONSE = { amount: 100, comment: "test", userId: mockedUserId }
  const notifyMock = { success: vi.fn(), error: vi.fn() }
  const onSubmitMock = vi.fn()

  beforeEach(() => {
    vi.restoreAllMocks()
    onSubmitMock.mockReset()
    notifyMock.success.mockReset()
    notifyMock.error.mockReset()
  })

  it("renders form inputs and button", () => {
    render(<Form onSubmit={onSubmitMock} />)

    expect(screen.getByLabelText("Amount *")).toBeInTheDocument()
    expect(screen.getByLabelText("Comment")).toBeInTheDocument()
    expect(screen.getByText(/0?0?\/200/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Top Up Balance/i })).toBeInTheDocument()
  })

  it("disables submit button if amount or comment invalid", () => {
    render(<Form onSubmit={onSubmitMock} />)

    const amountInput = screen.getByLabelText("Amount *") as HTMLInputElement
    const commentInput = screen.getByLabelText("Comment") as HTMLInputElement
    const button = screen.getByRole("button", { name: /Top Up Balance/i })

    fireEvent.change(amountInput, { target: { value: "0" } })
    expect(button).toBeDisabled()

    fireEvent.change(amountInput, { target: { value: "100" } })
    fireEvent.change(commentInput, { target: { value: "a".repeat(201) } })
    expect(button).toBeDisabled()
  })

  it("calls topUpBalanceAction and notify on successful submit", async () => {
    const topUpMock = vi.spyOn(balanceModule, "topUpBalanceAction").mockResolvedValue(MOCK_RESPONSE as unknown as balanceModule.BalanceOpearation)
    vi.spyOn(hooksModule, "useNotification").mockReturnValue(notifyMock as unknown as ReturnType<typeof hooksModule.useNotification>)

    render(<Form onSubmit={onSubmitMock} />)

    const button = screen.getByRole("button", { name: /Top Up Balance/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(topUpMock).toHaveBeenCalledWith({ amount: "100", comment: "", userId: mockedUserId })
      expect(onSubmitMock).toHaveBeenCalledWith(MOCK_RESPONSE)
      expect(notifyMock.success).toHaveBeenCalledWith({ message: "Balance has been successfully topped up" })
    })
  })

  it("shows error notification if topUpBalanceAction fails", async () => {
    const error = { message: "Network error" }
    vi.spyOn(balanceModule, "topUpBalanceAction").mockRejectedValue(error)
    vi.spyOn(hooksModule, "useNotification").mockReturnValue(notifyMock as unknown as ReturnType<typeof hooksModule.useNotification>)

    render(<Form onSubmit={onSubmitMock} />)

    const button = screen.getByRole("button", { name: /Top Up Balance/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(notifyMock.error).toHaveBeenCalledWith({ message: error.message })
      expect(onSubmitMock).not.toHaveBeenCalled()
    })
  })

  it("resets input fields after successful submit", async () => {
    vi.spyOn(balanceModule, "topUpBalanceAction").mockResolvedValue(MOCK_RESPONSE as unknown as balanceModule.BalanceOpearation)
    vi.spyOn(hooksModule, "useNotification").mockReturnValue(notifyMock as unknown as ReturnType<typeof hooksModule.useNotification>)

    render(<Form onSubmit={onSubmitMock} />)

    const amountInput = screen.getByLabelText("Amount *") as HTMLInputElement
    const commentInput = screen.getByLabelText("Comment") as HTMLInputElement
    const button = screen.getByRole("button", { name: /Top Up Balance/i })

    fireEvent.change(amountInput, { target: { value: "500" } })
    fireEvent.change(commentInput, { target: { value: "Test comment" } })

    fireEvent.click(button)

    await waitFor(() => {
      expect(amountInput.value).toBe("100")
      expect(commentInput.value).toBe("")
    })
  })

  it("disables submit button while topUpBalanceAction is pending", async () => {
    let resolvePromise!: (value: typeof MOCK_RESPONSE) => void

    const pendingPromise = new Promise<typeof MOCK_RESPONSE>((resolve) => {
      resolvePromise = resolve
    })

    vi.spyOn(balanceModule, "topUpBalanceAction").mockReturnValue(pendingPromise as unknown as ReturnType<typeof balanceModule.topUpBalanceAction>)

    vi.spyOn(balanceModule.topUpBalanceAction, "ready").mockReturnValue(false)

    vi.spyOn(hooksModule, "useNotification").mockReturnValue(notifyMock as unknown as ReturnType<typeof hooksModule.useNotification>)

    render(<Form onSubmit={onSubmitMock} />)
    const button = screen.getByRole("button", { name: /Top Up Balance/i })

    fireEvent.click(button)

    expect(button).toBeDisabled()

    resolvePromise(MOCK_RESPONSE)
    await pendingPromise
  })
})
