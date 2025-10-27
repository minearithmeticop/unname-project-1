import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'
import type { User, Session, AuthError } from '@supabase/supabase-js'

/**
 * Authentication Context
 * Provides authentication state and methods throughout the app
 */

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    try {
      console.log('📝 Attempting to sign up:', email)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) {
        console.error('❌ Sign up error:', error)
        return { error }
      }
      
      console.log('✅ Sign up successful:', {
        user: data.user?.email,
        needsConfirmation: data.user?.identities?.length === 0
      })
      
      return { error: null }
    } catch (error) {
      console.error('❌ Sign up exception:', error)
      return { error: error as AuthError }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting to sign in:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        console.error('❌ Sign in error:', error)
        return { error }
      }
      
      console.log('✅ Sign in successful:', data.user?.email)
      return { error: null }
    } catch (error) {
      console.error('❌ Sign in exception:', error)
      return { error: error as AuthError }
    }
  }

  const signOut = async () => {
    try {
      console.log('🚪 Signing out...')
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('❌ Sign out error:', error)
        return { error }
      }
      
      console.log('✅ Sign out successful')
      // Clear local state immediately
      setUser(null)
      setSession(null)
      
      return { error: null }
    } catch (error) {
      console.error('❌ Sign out exception:', error)
      return { error: error as AuthError }
    }
  }

  const resetPassword = async (email: string) => {
    try {
      console.log('🔄 Attempting to reset password for:', email)
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'myapp://reset-password', // Custom scheme for mobile
      })
      
      if (error) {
        console.error('❌ Reset password error:', error)
        return { error }
      }
      
      console.log('✅ Reset password email sent successfully')
      return { error: null }
    } catch (error) {
      console.error('❌ Reset password exception:', error)
      return { error: error as AuthError }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
