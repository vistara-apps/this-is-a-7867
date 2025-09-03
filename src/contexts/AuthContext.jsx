import React, { createContext, useState, useEffect, useContext } from 'react'
import { supabase } from '../lib/supabase'

// Create context
const AuthContext = createContext()

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true)
        
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) throw error
        
        setSession(session)
        setUser(session?.user || null)
        
        // Set up auth state listener
        const { data: { subscription } } = await supabase.auth.onAuthStateChange(
          (_event, session) => {
            setSession(session)
            setUser(session?.user || null)
          }
        )
        
        return () => {
          subscription.unsubscribe()
        }
      } catch (err) {
        console.error('Error initializing auth:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    initAuth()
  }, [])

  // Sign up with email and password
  const signUp = async (email, password, metadata = {}) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })
      
      if (error) throw error
      
      return { success: true, data }
    } catch (err) {
      console.error('Error signing up:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Sign in with email and password
  const signIn = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      return { success: true, data }
    } catch (err) {
      console.error('Error signing in:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error
      
      return { success: true }
    } catch (err) {
      console.error('Error signing out:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Reset password
  const resetPassword = async (email) => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })
      
      if (error) throw error
      
      return { success: true }
    } catch (err) {
      console.error('Error resetting password:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Update password
  const updatePassword = async (newPassword) => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) throw error
      
      return { success: true }
    } catch (err) {
      console.error('Error updating password:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.updateUser({
        data: updates
      })
      
      if (error) throw error
      
      // Update local user state
      setUser(prev => ({
        ...prev,
        user_metadata: {
          ...prev.user_metadata,
          ...updates
        }
      }))
      
      return { success: true }
    } catch (err) {
      console.error('Error updating profile:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Context value
  const value = {
    user,
    session,
    loading,
    error,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    clearError: () => setError(null)
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

