import { formatDate, isMockedModeStorageKey } from "../utils"
import { getAccessToken, removeAccessToken, saveAccessToken } from "./tokenManager"
import type { ApiError, HttpRequestOptions } from "./types"

export const request = async (endpoint: string, optionsParam: HttpRequestOptions = {}): Promise<Response> => {
  const isMockedModeStoraged = JSON.parse(localStorage.getItem(isMockedModeStorageKey) || "{}")

  if (isMockedModeStoraged.data) {
    return new Promise((resolve) => setTimeout(() => resolve(new Response("{}")), 1000))
  }

  const { retry = { count: 0 }, ...optionsWithBody } = optionsParam
  const { body, ...options } = optionsWithBody

  const baseUrl = `${import.meta.env.VITE_SERVER_URL}/api`
  const url = `${baseUrl}${endpoint}`

  const headers: HeadersInit = {
    ...options.headers,
  }

  if (body !== undefined && !(body instanceof FormData)) {
    Object.assign(headers, { "Content-Type": "application/json" })
  }

  const makeRequest = async (token: string | null) => {
    const startTime = Date.now()

    const controller = new AbortController()
    const timeoutId = options.timeout ? setTimeout(() => controller.abort(), options.timeout) : null

    const signal = options.signal ? AbortSignal.any([options.signal, controller.signal]) : controller.signal

    try {
      const response = await fetch(url, {
        ...options,
        credentials: "include",
        signal,
        headers: {
          ...headers,
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: body instanceof FormData ? body : JSON.stringify(body),
      })

      const now = new Date()
      const durationTime = now.getTime() - startTime
      console.log(`${options.method} ${url} - ${response.status} at ${formatDate(now, true)} (${durationTime}ms)`)

      return response
    } finally {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }

  try {
    const response = await makeRequest(getAccessToken())

    if (!response.ok) {
      const errorData: ApiError = await getErrorData(response)

      if (errorData.statusCode >= 500) {
        if (retry.count > 0) {
          console.error(`Fetch error ${errorData.statusCode}: ${errorData.message}`)
          console.log(`Retrying fetch: ${options.method} ${url}`)

          await new Promise((resolve) => setTimeout(resolve, retry.delay ?? 1500))

          return request(endpoint, { ...options, retry: { count: retry.count - 1, delay: retry.delay ?? 1500 } })
        }

        throwErr(errorData)
      }

      if (errorData.statusCode === 401) {
        console.error(`Fetch error 401: ${errorData.message}`)
        console.log("Refreshing token")

        await refreshToken(baseUrl)

        return await request(endpoint, optionsParam)
      } else {
        throwErr(errorData)
      }
    }

    return response
  } catch (error) {
    if (retry.count > 0 && !(error instanceof DOMException && error.name === "AbortError")) {
      console.error("Network Error\n\n", error)
      console.log(`Retrying fetch: ${options.method} ${url}`)

      await new Promise((resolve) => setTimeout(resolve, retry.delay ?? 1500))

      return await request(endpoint, {
        ...options,
        retry: { count: retry.count - 1, delay: retry.delay ?? 1500 },
      })
    }

    console.error(`Network Error: ${options.method} ${url} at ${formatDate(new Date(), true)}\n\n`, error)
    throw error
  }
}

let refreshPromise: Promise<string> | null = null

async function refreshToken(baseUrl: string): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const refreshResponse = await fetch(`${baseUrl}/auth/refresh`, {
          method: "POST",
          credentials: "include",
        })

        if (!refreshResponse.ok) {
          const errorData: ApiError = await getErrorData(refreshResponse)
          removeAccessToken()
          throwErr(errorData)
        }

        const { accessToken } = await refreshResponse.json()
        saveAccessToken(accessToken)
        return accessToken
      } finally {
        refreshPromise = null
      }
    })()
  }

  return refreshPromise
}

function throwErr({ message, statusCode }: ApiError) {
  const err = new Error(message || "An unexpected error occurred", { cause: { statusCode } })
  console.error("Fetch error", err)
  throw err
}

async function getErrorData(response: Response): Promise<ApiError> {
  try {
    return await response.json()
  } catch {
    return {
      message: response.statusText || "Network error",
      statusCode: response.status,
      name: "Network error",
    }
  }
}
