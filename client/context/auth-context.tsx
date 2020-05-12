import React from 'react'
import { useRouter } from 'next/router'

interface Auth {
  user: Record<string, any> | null
  login: () => void
  logout: () => void
  register: () => void
}

const AuthContext = React.createContext<Auth | null>(null)
AuthContext.displayName = 'AuthContext'

export const AuthProvider: React.FunctionComponent = props => {
  const [user, setUser] = React.useState(null)
  const { pathname, events } = useRouter()

  const login = () => console.log('login')

  const register = () => console.log('register')

  const logout = () => console.log('logout')

  const getUser = () => {
    let user

    if (typeof localStorage !== 'undefined') {
      const storageUser = localStorage.getItem('user')
      user = storageUser ? JSON.parse(storageUser) : null
    }

    setUser(user)
  }

  React.useEffect(() => {
    getUser()
  }, [pathname])

  const value = React.useMemo(() => ({ user, login, register, logout }), [
    login,
    logout,
    register,
    user
  ])

  React.useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (url !== '/' && url !== '/reset-password' && !user) {
        window.location.href = '/login'
      }
    }

    if (pathname !== '/' && pathname !== '/reset-password' && !user) {
      window.location.href = '/'
    }

    events.on('routeChangeStart', handleRouteChange)

    return () => {
      events.off('routeChangeStart', handleRouteChange)
    }
  }, [user])

  return <AuthContext.Provider value={value} {...props} />
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider')
  }
  return context
}
