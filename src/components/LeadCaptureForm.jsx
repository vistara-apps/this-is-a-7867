import React, { useState } from 'react'
import { Send, AlertCircle, CheckCircle } from 'lucide-react'
import { trackEvent, EVENT_TYPES } from '../lib/analytics'

function LeadCaptureForm({ calculator, result, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)
      
      // Validate email
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('Please enter a valid email address')
      }
      
      // Track lead capture event
      const metadata = {
        ...formData,
        result: result,
        timestamp: new Date().toISOString()
      }
      
      const { success, error } = await trackEvent(
        calculator.calculatorId,
        EVENT_TYPES.LEAD_CAPTURE,
        metadata
      )
      
      if (!success) throw new Error(error || 'Failed to capture lead')
      
      setSuccess(true)
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(formData)
      }
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: ''
        })
        setSuccess(false)
      }, 3000)
    } catch (err) {
      console.error('Error capturing lead:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Get Your Result
      </h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      
      {success ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md text-center">
          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <h4 className="font-medium text-green-800 mb-1">Thank You!</h4>
          <p className="text-sm text-green-700">
            Your result has been sent to your email.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Your name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="your.email@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
              placeholder="Your phone number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Company
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="input-field"
              placeholder="Your company name"
            />
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {loading ? (
                <span className="inline-block h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Get Result
                </>
              )}
            </button>
          </div>
          
          <p className="text-xs text-text-secondary text-center">
            By submitting this form, you agree to our{' '}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </form>
      )}
    </div>
  )
}

export default LeadCaptureForm

