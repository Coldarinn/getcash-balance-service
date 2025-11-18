import { request } from "./request"
import type { HttpRequestOptions } from "./types"

type ApiOptions = Omit<HttpRequestOptions, "method">

class Api {
  async get<T>(url: string, options: ApiOptions = {}): Promise<T> {
    const response = await request(url, { ...options, method: "GET" })
    return this.parseResponse(response)
  }

  async post<T>(url: string, options: ApiOptions = {}): Promise<T> {
    const response = await request(url, {
      ...options,
      method: "POST",
    })
    return this.parseResponse(response)
  }

  async put<T>(url: string, options: ApiOptions = {}): Promise<T> {
    const response = await request(url, {
      ...options,
      method: "PUT",
    })
    return this.parseResponse(response)
  }

  async patch<T>(url: string, options: ApiOptions = {}): Promise<T> {
    const response = await request(url, {
      ...options,
      method: "PATCH",
    })
    return this.parseResponse(response)
  }

  async delete<T>(url: string, options: ApiOptions = {}): Promise<T> {
    const response = await request(url, { ...options, method: "DELETE" })
    return this.parseResponse(response)
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const text = await response.text()
    if (!text) return null as T
    return JSON.parse(text) as T
  }
}

export const api = new Api()
