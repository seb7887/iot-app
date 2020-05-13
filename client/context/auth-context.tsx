import React from 'react'
import { useRouter } from 'next/router'

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
}

const AuthContext = React.createContext<Auth | null>(null)
AuthContext.displayName = 'AuthContext'

export const AuthProvider: React.FunctionComponent = props => {
  const { push } = useRouter()

  const signIn = async (email: string, password: string) => {
    const { user } = await login(email, password)
    const cookie = new Token()

    if (!user) {
      throw new Error('Invalid email or password')
    }

    if (user.token) {
      cookie.saveToken(user.token)
      push('/dashboard')
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
      push('/dashboard')
    }

    const { resetToken, ...filtered } = user
    return filtered
  }

  const signOut = () => {
    const cookie = new Token()
    cookie.clearToken()
    push('/')
  }

  const value = React.useMemo(() => ({ signIn, signOut, signUp }), [
    signIn,
    signOut,
    signUp
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
