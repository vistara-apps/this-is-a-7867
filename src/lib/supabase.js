import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
)

// Auth functions
export const signUp = async ({ email, password, fullName }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })
  return { data, error }
}

export const signIn = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  return { data, error }
}

export const updatePassword = async (newPassword) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  })
  return { data, error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

// Database functions
export const fetchUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
  return { data, error }
}

// Calculator functions
export const fetchCalculators = async (userId) => {
  const { data, error } = await supabase
    .from('calculators')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const fetchCalculator = async (calculatorId) => {
  const { data, error } = await supabase
    .from('calculators')
    .select('*')
    .eq('id', calculatorId)
    .single()
  return { data, error }
}

export const createCalculator = async (calculatorData) => {
  const { data, error } = await supabase
    .from('calculators')
    .insert([calculatorData])
    .select()
  return { data, error }
}

export const updateCalculator = async (calculatorId, updates) => {
  const { data, error } = await supabase
    .from('calculators')
    .update(updates)
    .eq('id', calculatorId)
    .select()
  return { data, error }
}

export const deleteCalculator = async (calculatorId) => {
  const { error } = await supabase
    .from('calculators')
    .delete()
    .eq('id', calculatorId)
  return { error }
}

// Usage events functions
export const createUsageEvent = async (eventData) => {
  const { data, error } = await supabase
    .from('usage_events')
    .insert([eventData])
  return { data, error }
}

export const fetchUsageEvents = async (calculatorId) => {
  const { data, error } = await supabase
    .from('usage_events')
    .select('*')
    .eq('calculator_id', calculatorId)
    .order('timestamp', { ascending: false })
  return { data, error }
}

export const fetchUsageStats = async (calculatorId) => {
  const { data, error } = await supabase
    .from('usage_events')
    .select('event_type, count(*)')
    .eq('calculator_id', calculatorId)
    .group('event_type')
  return { data, error }
}

