import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { AlertCircle, Loader2 } from 'lucide-react'

function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { signIn, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Get redirect path from query params
  const searchParams = new URLSearchParams(location.search)
  const redirectPath = searchParams.get('redirect') || '/app'

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setError(null)
      
      // Validate inputs
      if (!email.trim()) {
        throw new Error('Email is required')
      }
      
      if (!password) {
        throw new Error('Password is required')
      }
      
      // Sign in
      const { success, error } = await signIn(email, password)
      
      if (!success) {
        throw new Error(error || 'Failed to sign in')
      }
      
      // Redirect to dashboard or specified redirect path
      navigate(redirectPath)
    } catch (err) {
      console.error('Sign in error:', err)
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
            Sign in to your account
          </h1>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-text-primary">
                Password
              </label>
              <Link to="/auth/reset-password" className="text-xs text-primary hover:text-primary/80">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              'Sign In'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-text-secondary">
            Don't have an account?{' '}
            <Link to="/auth/sign-up" className="text-primary hover:text-primary/80 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignIn

