const RETRY_DELAYS = [3000, 5000, 8000]

export async function fetchWithRetry(input: RequestInfo | URL) {
  let lastError: unknown

  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt += 1) {
    try {
      const response = await fetch(input)

      if (response.ok || ![502, 503, 504].includes(response.status)) {
        return response
      }

      lastError = new Error(`Service unavailable: ${response.status}`)
    } catch (error) {
      lastError = error
    }

    const delay = RETRY_DELAYS[attempt]
    if (delay === undefined) break
    await new Promise((resolve) => window.setTimeout(resolve, delay))
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Failed to reach the content service')
}
