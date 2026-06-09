import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

interface AuthUser {
  email: string
  name: string
}

interface AuthContextType {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = sessionStorage.getItem('sce_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    const fakeUser: AuthUser = { email, name: 'Admin Demo' }
    sessionStorage.setItem('sce_user', JSON.stringify(fakeUser))
    setUser(fakeUser)
    return true
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem('sce_user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
