import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react'

function ResetPassword() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [isReset, setIsReset] = useState(false)
  const { resetPassword, updatePassword, loading } = useAuth()
  const navigate = useNavigate()
  const { token } = useParams()

  // Check if this is a password reset (has token) or password request
  useEffect(() => {
    if (token) {
      setIsReset(true)
    }
  }, [token])

  const handleRequestReset = async (e) => {
    e.preventDefault()
    
    try {
      setError(null)
      
      // Validate email
      if (!email.trim()) {
        throw new Error('Email is required')
      }
      
      // Request password reset
      const { success, error } = await resetPassword(email)
      
      if (!success) {
        throw new Error(error || 'Failed to send reset email')
      }
      
      // Show success message
      setSuccess(true)
      
      // Clear form
      setEmail('')
    } catch (err) {
      console.error('Reset password error:', err)
      setError(err.message)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    
    try {
      setError(null)
      
      // Validate passwords
      if (!password) {
        throw new Error('Password is required')
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }
      
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match')
      }
      
      // Update password
      const { success, error } = await updatePassword(password)
      
      if (!success) {
        throw new Error(error || 'Failed to update password')
      }
      
      // Show success message
      setSuccess(true)
      
      // Clear form
      setPassword('')
      setConfirmPassword('')
      
      // Redirect to sign in after 3 seconds
      setTimeout(() => {
        navigate('/auth/sign-in')
      }, 3000)
    } catch (err) {
      console.error('Update password error:', err)
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-primary">
            FormulaFlow
          </Link>
          <h1 className="text-xl font-semibold text-text-primary mt-4">
            {isReset ? 'Reset Your Password' : 'Forgot Your Password?'}
          </h1>
          {!isReset && (
            <p className="text-text-secondary mt-2">
              Enter your email and we'll send you a link to reset your password.
            </p>
          )}
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        {success ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h2 className="text-lg font-medium text-green-800 mb-1">
              {isReset ? 'Password Updated!' : 'Check Your Email'}
            </h2>
            <p className="text-sm text-green-700 mb-4">
              {isReset 
                ? 'Your password has been successfully reset.' 
                : 'We\'ve sent you an email with a link to reset your password.'}
            </p>
            <Link to="/auth/sign-in" className="btn-primary inline-block">
              Sign In
            </Link>
          </div>
        ) : isReset ? (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1">
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
              <p className="text-xs text-text-secondary mt-1">
                Must be at least 6 characters
              </p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-1">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="your.email@example.com"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        )}
        
        <div className="mt-6 text-center">
          <p className="text-sm text-text-secondary">
            Remember your password?{' '}
            <Link to="/auth/sign-in" className="text-primary hover:text-primary/80 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword

