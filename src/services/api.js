const BASE_URL = "http://localhost:8080/api"

async function request(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: options.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      body: options.body ? options.body : undefined
    })

    let data = null

    // Protect against empty body or non-json responses
    try {
      data = await response.json()
    } catch {
      data = null
    }

    if (!response.ok) {
      throw {
        status: response.status,
        code: data?.code ?? "API_ERROR",
        message: data?.message ?? response.statusText,
        details: data?.details ?? null
      }
    }

    return data
  } catch (error) {
    console.error("API Error:", error)
    throw error
  }
}

export const api = {
  getAccounts() {
    return request("/accounts")
  },

  GetAccountByUserIdAsync(userId) {
    return request(`/accounts/userId/${userId}`)
  },

  getTrasationsByAccount(accountId) {
    return request(`/transactions/${accountId}`)
  },

  transferFunds(payload) {
    return request("/transfers", {
      method: "POST",
      body: JSON.stringify(payload)
    })
  },

  login(payload) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    })
  },

  pay(payload) {
    return request("/payment/pay", {
      method: "POST",
      body: JSON.stringify(payload)
    })
  },

  updateUserDetails(payload) {
    return request("/users/update-profile", {
      method: "PUT",
      body: JSON.stringify(payload)
    })
  },

  register(payload) {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    })
  },

  purchaseAirtime(payload) {
    return request("/airtime/purchase", {
      method: "POST",
      body: JSON.stringify(payload)
    })
  },
}

export { request as apiFetch }
