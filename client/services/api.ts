import { NextPageContext } from 'next'
import fetch from 'isomorphic-unfetch'

import { Token } from '../context'

export const apiCall = async <T>(path: string, options: {}) => {
  try {
    let payload
    const url = `${process.env.API_URL}${path}`
    const res = await fetch(url, options)

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

const getToken = (ctx?: NextPageContext) => {
  const cookies = new Token()
  return cookies.getToken(ctx)
}

export const apiGet = async <T>(path: string, ctx?: NextPageContext) => {
  const token = getToken(ctx)
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

export const login = async (email: string, password: string) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  }

  return apiCall<UserResponse>('/users/login', options)
}

interface RegisterRequest {
  username: string
  email: string
  password: string
}

export const register = async (req: RegisterRequest) => {
  const { username, email, password } = req

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      email,
      password,
      role: 'admin'
    })
  }

  return apiCall<UserResponse>('/users', options)
}
