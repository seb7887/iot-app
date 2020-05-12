import fetch from 'isomorphic-unfetch'
import Cookies from 'universal-cookie'

export const apiCall = async <T>(path: string, options: {}) => {
  try {
    let payload
    const res = await fetch(`${process.env.API_URL}${path}`, options)

    try {
      payload = await res.json()
    } catch {
      payload = null
    }

    return payload as T
  } catch (err) {
    throw err
  }
}

const getToken = () => {
  const cookies = new Cookies()
  const token = cookies.get('token')

  return token
}

export const apiGet = async <T>(path: string) => {
  const token = getToken()
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  return apiCall<T>(path, options)
}

export const apiPost = async <T>(path: string, body: Record<string, any>) => {
  const token = getToken()
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }

  return apiCall<T>(path, options)
}

export const apiPut = async <T>(path: string, body: Record<string, any>) => {
  const token = getToken()
  const options = {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }

  return apiCall<T>(path, options)
}

export const apiDelete = async <T>(path: string) => {
  const token = getToken()
  const options = {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  return apiCall<T>(path, options)
}

interface ValidateResponse {
  isValid: boolean
}

export const validateJwt = async (jwt: string) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ jwt })
  }

  return apiCall<ValidateResponse>('/users/validate-jwt', options)
}
