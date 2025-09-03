import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  signIn, 
  signUp, 
  signOut as supabaseSignOut, 
  resetPassword, 
  updatePassword 
} from '../lib/supabase'

export function useAuthActions() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleSignIn = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await signIn({ email, password })
      
      if (error) throw error
      
      navigate('/app')
      return data
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (email, password, fullName) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await signUp({ email, password, fullName })
      
      if (error) throw error
      
      navigate('/auth/verify-email')
      return data
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await supabaseSignOut()
      
      if (error) throw error
      
      navigate('/')
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (email) => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await resetPassword(email)
      
      if (error) throw error
      
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async (newPassword) => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await updatePassword(newPassword)
      
      if (error) throw error
      
      navigate('/app')
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    error,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    updatePassword: handleUpdatePassword,
    clearError: () => setError(null),
  }
}

