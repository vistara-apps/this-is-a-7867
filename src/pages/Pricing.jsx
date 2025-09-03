import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSubscription } from '../hooks/useSubscription'
import { useAuth } from '../contexts/AuthContext'
import { Check, AlertCircle, Loader2 } from 'lucide-react'

function Pricing() {
  const { isAuthenticated } = useAuth()
  const { 
    currentPlan, 
    plans, 
    subscribe, 
    loading, 
    error 
  } = useSubscription()
  const [billingPeriod, setBillingPeriod] = useState('monthly')

  const handleSubscribe = async (planId) => {
    if (!isAuthenticated) {
      // Redirect to sign in page
      window.location.href = `/auth/sign-in?redirect=${encodeURIComponent('/pricing')}`
      return
    }
    
    // If already on this plan, do nothing
    if (currentPlan.id === planId) {
      return
    }
    
    // Subscribe to plan
    await subscribe(planId)
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Choose the plan that's right for you and start building powerful calculators today.
          </p>
          
          {/* Billing period toggle */}
          <div className="mt-8 inline-flex items-center p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                billingPeriod === 'monthly'
                  ? 'bg-white shadow-sm text-text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                billingPeriod === 'yearly'
                  ? 'bg-white shadow-sm text-text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Yearly <span className="text-accent">Save 20%</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className={`bg-white rounded-xl shadow-md overflow-hidden border-2 ${
            currentPlan.id === 'free' ? 'border-primary' : 'border-transparent'
          }`}>
            <div className="p-6">
              <h3 className="text-xl font-bold text-text-primary mb-2">{plans.FREE.name}</h3>
              <p className="text-text-secondary mb-4">{plans.FREE.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-text-primary">${plans.FREE.price}</span>
                <span className="text-text-secondary">/month</span>
              </div>
              <button
                onClick={() => handleSubscribe('free')}
                disabled={currentPlan.id === 'free' || loading}
                className={`w-full py-2 px-4 rounded-md font-medium ${
                  currentPlan.id === 'free'
                    ? 'bg-gray-100 text-text-primary cursor-default'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                {currentPlan.id === 'free' ? 'Current Plan' : 'Get Started'}
              </button>
            </div>
            <div className="px-6 pb-6">
              <h4 className="font-medium text-text-primary mb-4">What's included:</h4>
              <ul className="space-y-3">
                {plans.FREE.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-accent mr-2 flex-shrink-0" />
                    <span className="text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pro Plan */}
          <div className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 ${
            currentPlan.id === 'pro' ? 'border-primary' : 'border-transparent'
          } transform md:scale-105 z-10`}>
            <div className="bg-primary/10 py-2 text-center">
              <span className="text-sm font-medium text-primary">Most Popular</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-text-primary mb-2">{plans.PRO.name}</h3>
              <p className="text-text-secondary mb-4">{plans.PRO.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-text-primary">
                  ${billingPeriod === 'yearly' ? Math.round(plans.PRO.price * 0.8) : plans.PRO.price}
                </span>
                <span className="text-text-secondary">/month</span>
                {billingPeriod === 'yearly' && (
                  <span className="ml-2 text-sm text-accent">Save 20%</span>
                )}
              </div>
              <button
                onClick={() => handleSubscribe('pro')}
                disabled={currentPlan.id === 'pro' || loading}
                className={`w-full py-2 px-4 rounded-md font-medium ${
                  currentPlan.id === 'pro'
                    ? 'bg-gray-100 text-text-primary cursor-default'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                ) : currentPlan.id === 'pro' ? (
                  'Current Plan'
                ) : (
                  'Upgrade to Pro'
                )}
              </button>
            </div>
            <div className="px-6 pb-6">
              <h4 className="font-medium text-text-primary mb-4">What's included:</h4>
              <ul className="space-y-3">
                {plans.PRO.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-accent mr-2 flex-shrink-0" />
                    <span className="text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Business Plan */}
          <div className={`bg-white rounded-xl shadow-md overflow-hidden border-2 ${
            currentPlan.id === 'business' ? 'border-primary' : 'border-transparent'
          }`}>
            <div className="p-6">
              <h3 className="text-xl font-bold text-text-primary mb-2">{plans.BUSINESS.name}</h3>
              <p className="text-text-secondary mb-4">{plans.BUSINESS.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-text-primary">
                  ${billingPeriod === 'yearly' ? Math.round(plans.BUSINESS.price * 0.8) : plans.BUSINESS.price}
                </span>
                <span className="text-text-secondary">/month</span>
                {billingPeriod === 'yearly' && (
                  <span className="ml-2 text-sm text-accent">Save 20%</span>
                )}
              </div>
              <button
                onClick={() => handleSubscribe('business')}
                disabled={currentPlan.id === 'business' || loading}
                className={`w-full py-2 px-4 rounded-md font-medium ${
                  currentPlan.id === 'business'
                    ? 'bg-gray-100 text-text-primary cursor-default'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                ) : currentPlan.id === 'business' ? (
                  'Current Plan'
                ) : (
                  'Upgrade to Business'
                )}
              </button>
            </div>
            <div className="px-6 pb-6">
              <h4 className="font-medium text-text-primary mb-4">What's included:</h4>
              <ul className="space-y-3">
                {plans.BUSINESS.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-accent mr-2 flex-shrink-0" />
                    <span className="text-text-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto mt-8 grid gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-text-primary mb-2">
                Can I change plans later?
              </h3>
              <p className="text-text-secondary">
                Yes, you can upgrade, downgrade, or cancel your subscription at any time. Changes to your plan will take effect immediately.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-text-primary mb-2">
                Is there a free trial?
              </h3>
              <p className="text-text-secondary">
                We offer a free plan with limited features that you can use indefinitely. This allows you to try out the platform before committing to a paid plan.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-text-primary mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-text-secondary">
                We accept all major credit cards including Visa, Mastercard, American Express, and Discover. All payments are processed securely through Stripe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pricing

