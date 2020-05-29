import React from 'react'

import { login, register } from '../services/api'
import { Token } from './token'

interface Auth {
  signIn: (email: string, password: string) => Promise<Partial<User>>
  signOut: () => void
  signUp: (
    username: string,
    email: string,
    password: string
  ) => Promise<Partial<User>>
  isAdmin: () => boolean
}

const AuthContext = React.createContext<Auth | null>(null)
AuthContext.displayName = 'AuthContext'

export const AuthProvider: React.FunctionComponent = props => {
  const signIn = async (email: string, password: string) => {
    const { user } = await login(email, password)
    const cookie = new Token()

    if (!user) {
      throw new Error('Invalid email or password')
    }

    if (user.token) {
      cookie.saveToken(user.token)
    }

    const { token, resetToken, ...filtered } = user
    return filtered
  }

  const signUp = async (username: string, email: string, password: string) => {
    const { user } = await register({
      username,
      email,
      password
    })

    if (!user) {
      throw new Error('Sign Up error. Try again!')
    }

    const {
      user: { token }
    } = await login(email, password)
    const cookie = new Token()

    if (token) {
      cookie.saveToken(token)
    }

    const { resetToken, ...filtered } = user
    return filtered
  }

  const signOut = () => {
    const cookie = new Token()
    cookie.clearToken()
  }

  const isAdmin = () => {
    if (typeof localStorage !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user') || '')
      return user && user.role === 'admin'
    }
    return false
  }

  const value = React.useMemo(() => ({ signIn, signOut, signUp, isAdmin }), [
    signIn,
    signOut,
    signUp,
    isAdmin
  ])

  return <AuthContext.Provider value={value} {...props} />
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider')
  }
  return context
}
