import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  getSubscription, 
  createCheckoutSession, 
  cancelSubscription, 
  updateSubscription, 
  createPortalSession,
  PLANS
} from '../lib/stripe'

export function useSubscription() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch subscription data
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setSubscription(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const { subscription: subData, error: subError } = await getSubscription(user.id)
        
        if (subError) throw new Error(subError)
        
        setSubscription(subData)
      } catch (err) {
        console.error('Error fetching subscription:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [user])

  // Get current plan
  const getCurrentPlan = () => {
    if (!user) return PLANS.FREE
    
    // If no subscription or canceled, return free plan
    if (!subscription || subscription.status === 'canceled') {
      return PLANS.FREE
    }
    
    // Get product ID from subscription
    const productId = subscription.prices?.products?.id
    
    // Find matching plan
    if (productId === import.meta.env.VITE_STRIPE_PRO_PRODUCT_ID) {
      return PLANS.PRO
    } else if (productId === import.meta.env.VITE_STRIPE_BUSINESS_PRODUCT_ID) {
      return PLANS.BUSINESS
    }
    
    // Default to free plan
    return PLANS.FREE
  }

  // Check if user has access to a feature
  const hasAccess = (feature) => {
    const currentPlan = getCurrentPlan()
    return currentPlan.limits[feature] !== undefined && currentPlan.limits[feature] !== false
  }

  // Subscribe to a plan
  const subscribe = async (planId) => {
    try {
      setLoading(true)
      setError(null)
      
      const plan = PLANS[planId.toUpperCase()]
      if (!plan || !plan.priceId) {
        throw new Error('Invalid plan selected')
      }
      
      const { success, error: checkoutError } = await createCheckoutSession(plan.priceId, user.id)
      
      if (!success) throw new Error(checkoutError)
      
      return true
    } catch (err) {
      console.error('Error subscribing to plan:', err)
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Cancel subscription
  const cancel = async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (!subscription) {
        throw new Error('No active subscription found')
      }
      
      const { success, error: cancelError } = await cancelSubscription(subscription.id)
      
      if (!success) throw new Error(cancelError)
      
      // Update local subscription data
      setSubscription({
        ...subscription,
        status: 'canceled',
        cancel_at_period_end: true
      })
      
      return true
    } catch (err) {
      console.error('Error cancelling subscription:', err)
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Change subscription plan
  const changePlan = async (newPlanId) => {
    try {
      setLoading(true)
      setError(null)
      
      if (!subscription) {
        throw new Error('No active subscription found')
      }
      
      const plan = PLANS[newPlanId.toUpperCase()]
      if (!plan || !plan.priceId) {
        throw new Error('Invalid plan selected')
      }
      
      const { success, error: updateError } = await updateSubscription(subscription.id, plan.priceId)
      
      if (!success) throw new Error(updateError)
      
      // Refresh subscription data
      const { subscription: updatedSub } = await getSubscription(user.id)
      setSubscription(updatedSub)
      
      return true
    } catch (err) {
      console.error('Error changing subscription plan:', err)
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Open customer portal
  const manageSubscription = async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (!subscription) {
        throw new Error('No active subscription found')
      }
      
      const { success, error: portalError } = await createPortalSession(subscription.customer_id)
      
      if (!success) throw new Error(portalError)
      
      return true
    } catch (err) {
      console.error('Error opening customer portal:', err)
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    subscription,
    loading,
    error,
    currentPlan: getCurrentPlan(),
    hasAccess,
    subscribe,
    cancel,
    changePlan,
    manageSubscription,
    plans: PLANS
  }
}

