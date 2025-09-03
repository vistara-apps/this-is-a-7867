import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSubscription } from '../hooks/useSubscription'
import { useAuth } from '../contexts/AuthContext'
import { AlertCircle, ArrowLeft, CreditCard, Shield } from 'lucide-react'

function Checkout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { 
    plans, 
    subscribe, 
    loading: subscriptionLoading, 
    error: subscriptionError 
  } = useSubscription()
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [error, setError] = useState('')

  // Get plan ID from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const planId = params.get('plan')
    
    if (planId && ['pro', 'business'].includes(planId)) {
      setSelectedPlan(plans[planId.toUpperCase()])
    } else {
      setError('Invalid plan selected')
    }
  }, [location.search, plans])

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(`/auth/sign-in?redirect=${encodeURIComponent(location.pathname + location.search)}`)
    }
  }, [authLoading, isAuthenticated, navigate, location])

  const handleCheckout = async () => {
    if (!selectedPlan) {
      setError('Please select a plan')
      return
    }
    
    await subscribe(selectedPlan.id)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="inline-block h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-text-secondary">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <button
          onClick={() => navigate('/pricing')}
          className="inline-flex items-center text-primary hover:text-primary/80 mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Pricing
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-text-primary mb-6">Order Summary</h2>
            
            {selectedPlan ? (
              <div>
                <div className="flex justify-between mb-4">
                  <span className="text-text-secondary">Plan</span>
                  <span className="font-medium text-text-primary">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-text-secondary">Billing Period</span>
                  <span className="font-medium text-text-primary">Monthly</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-text-secondary">Price</span>
                  <span className="font-medium text-text-primary">${selectedPlan.price}/month</span>
                </div>
                
                <hr className="my-6" />
                
                <div className="flex justify-between mb-4">
                  <span className="text-text-secondary">Total</span>
                  <span className="text-lg font-bold text-text-primary">${selectedPlan.price}</span>
                </div>
                
                <div className="mt-6 space-y-4">
                  <h3 className="font-medium text-text-primary">What's included:</h3>
                  <ul className="space-y-2">
                    {selectedPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <Check className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-text-secondary">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-text-secondary">No plan selected</p>
              </div>
            )}
          </div>

          {/* Payment form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-text-primary mb-6">Payment Information</h2>
            
            {(error || subscriptionError) && (
              <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error || subscriptionError}</p>
              </div>
            )}
            
            <div className="mb-6">
              <p className="text-text-secondary mb-4">
                You'll be redirected to our secure payment processor to complete your purchase.
              </p>
              
              <div className="flex items-center justify-center space-x-2 text-sm text-text-secondary mb-4">
                <Shield className="h-4 w-4" />
                <span>Secure payment processing by Stripe</span>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={!selectedPlan || subscriptionLoading}
              className="w-full btn-primary flex items-center justify-center"
            >
              {subscriptionLoading ? (
                <span className="inline-block h-5 w-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Payment
                </>
              )}
            </button>
            
            <div className="mt-6 text-center text-sm text-text-secondary">
              By proceeding, you agree to our{' '}
              <a href="/terms" className="text-primary hover:text-primary/80">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary hover:text-primary/80">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

