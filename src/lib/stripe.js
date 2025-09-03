import { loadStripe } from '@stripe/stripe-js'
import { supabase } from './supabase'

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

// Subscription plans
export const PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    description: 'Basic calculators with limited embeds',
    price: 0,
    features: [
      'Create up to 3 calculators',
      'Basic formula builder',
      'Standard input fields',
      'Limited embedding options',
      'Basic analytics'
    ],
    limits: {
      calculators: 3,
      embeds: 1000,
      inputs: 5,
      customization: false,
      aiAssistant: false,
      analytics: 'basic',
      leadCapture: false
    }
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    description: 'Custom formulas, advanced UIs, and analytics',
    price: 25,
    priceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID,
    features: [
      'Create unlimited calculators',
      'Advanced formula builder',
      'Custom input fields',
      'Advanced embedding options',
      'Detailed analytics',
      'Lead capture',
      'AI formula assistance'
    ],
    limits: {
      calculators: Infinity,
      embeds: 10000,
      inputs: 20,
      customization: true,
      aiAssistant: true,
      analytics: 'advanced',
      leadCapture: true
    }
  },
  BUSINESS: {
    id: 'business',
    name: 'Business',
    description: 'Team collaboration, API access, and priority support',
    price: 75,
    priceId: import.meta.env.VITE_STRIPE_BUSINESS_PRICE_ID,
    features: [
      'Everything in Pro',
      'Team collaboration',
      'API access',
      'White-label calculators',
      'Priority support',
      'Custom domains',
      'Advanced integrations'
    ],
    limits: {
      calculators: Infinity,
      embeds: Infinity,
      inputs: Infinity,
      customization: true,
      aiAssistant: true,
      analytics: 'premium',
      leadCapture: true,
      teamMembers: 5,
      api: true,
      whiteLabel: true
    }
  }
}

// Create checkout session
export const createCheckoutSession = async (priceId, userId) => {
  try {
    // Call Supabase function to create checkout session
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { priceId, userId }
    })

    if (error) throw error

    // Redirect to checkout
    const stripe = await stripePromise
    const { error: stripeError } = await stripe.redirectToCheckout({
      sessionId: data.sessionId
    })

    if (stripeError) throw stripeError

    return { success: true }
  } catch (err) {
    console.error('Error creating checkout session:', err)
    return { success: false, error: err.message }
  }
}

// Get subscription for user
export const getSubscription = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .eq('user_id', userId)
      .single()

    if (error) throw error

    return { subscription: data }
  } catch (err) {
    console.error('Error fetching subscription:', err)
    return { subscription: null, error: err.message }
  }
}

// Cancel subscription
export const cancelSubscription = async (subscriptionId) => {
  try {
    const { data, error } = await supabase.functions.invoke('cancel-subscription', {
      body: { subscriptionId }
    })

    if (error) throw error

    return { success: true, data }
  } catch (err) {
    console.error('Error cancelling subscription:', err)
    return { success: false, error: err.message }
  }
}

// Update subscription
export const updateSubscription = async (subscriptionId, newPriceId) => {
  try {
    const { data, error } = await supabase.functions.invoke('update-subscription', {
      body: { subscriptionId, newPriceId }
    })

    if (error) throw error

    return { success: true, data }
  } catch (err) {
    console.error('Error updating subscription:', err)
    return { success: false, error: err.message }
  }
}

// Create customer portal session
export const createPortalSession = async (customerId) => {
  try {
    const { data, error } = await supabase.functions.invoke('create-portal-session', {
      body: { customerId }
    })

    if (error) throw error

    // Redirect to customer portal
    window.location.href = data.url

    return { success: true }
  } catch (err) {
    console.error('Error creating portal session:', err)
    return { success: false, error: err.message }
  }
}

