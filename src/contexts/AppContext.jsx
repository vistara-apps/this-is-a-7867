import React, { createContext, useState, useEffect, useContext } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from '../lib/supabase'

// Create context
const AppContext = createContext()

// App provider component
export function AppProvider({ children }) {
  const { user } = useAuth()
  const [calculators, setCalculators] = useState([])
  const [selectedCalculator, setSelectedCalculator] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch user's calculators when user changes
  useEffect(() => {
    const fetchCalculators = async () => {
      if (!user) {
        setCalculators([])
        setSelectedCalculator(null)
        return
      }
      
      try {
        setLoading(true)
        setError(null)
        
        const { data, error } = await supabase
          .from('calculators')
          .select('*')
          .eq('userId', user.id)
          .order('createdAt', { ascending: false })
        
        if (error) throw error
        
        setCalculators(data || [])
        
        // Set first calculator as selected if available and none is selected
        if (data && data.length > 0 && !selectedCalculator) {
          setSelectedCalculator(data[0])
        }
      } catch (err) {
        console.error('Error fetching calculators:', err)
        setError('Failed to load calculators')
      } finally {
        setLoading(false)
      }
    }
    
    fetchCalculators()
  }, [user, selectedCalculator])

  // Create a new calculator
  const createCalculator = async (calculatorData) => {
    try {
      setLoading(true)
      setError(null)
      
      if (!user) {
        throw new Error('You must be logged in to create a calculator')
      }
      
      const newCalculator = {
        ...calculatorData,
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      const { data, error } = await supabase
        .from('calculators')
        .insert([newCalculator])
        .select()
      
      if (error) throw error
      
      // Update calculators list
      setCalculators(prev => [data[0], ...prev])
      
      // Set as selected calculator
      setSelectedCalculator(data[0])
      
      return { success: true, data: data[0] }
    } catch (err) {
      console.error('Error creating calculator:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Update an existing calculator
  const updateCalculator = async (calculatorId, updates) => {
    try {
      setLoading(true)
      setError(null)
      
      if (!user) {
        throw new Error('You must be logged in to update a calculator')
      }
      
      const { data, error } = await supabase
        .from('calculators')
        .update({
          ...updates,
          updatedAt: new Date().toISOString()
        })
        .eq('calculatorId', calculatorId)
        .eq('userId', user.id) // Ensure user owns the calculator
        .select()
      
      if (error) throw error
      
      // Update calculators list
      setCalculators(prev => 
        prev.map(calc => calc.calculatorId === calculatorId ? data[0] : calc)
      )
      
      // Update selected calculator if it's the one being updated
      if (selectedCalculator && selectedCalculator.calculatorId === calculatorId) {
        setSelectedCalculator(data[0])
      }
      
      return { success: true, data: data[0] }
    } catch (err) {
      console.error('Error updating calculator:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Delete a calculator
  const deleteCalculator = async (calculatorId) => {
    try {
      setLoading(true)
      setError(null)
      
      if (!user) {
        throw new Error('You must be logged in to delete a calculator')
      }
      
      const { error } = await supabase
        .from('calculators')
        .delete()
        .eq('calculatorId', calculatorId)
        .eq('userId', user.id) // Ensure user owns the calculator
      
      if (error) throw error
      
      // Update calculators list
      setCalculators(prev => prev.filter(calc => calc.calculatorId !== calculatorId))
      
      // Clear selected calculator if it's the one being deleted
      if (selectedCalculator && selectedCalculator.calculatorId === calculatorId) {
        setSelectedCalculator(null)
      }
      
      return { success: true }
    } catch (err) {
      console.error('Error deleting calculator:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Get a calculator by ID
  const getCalculator = async (calculatorId) => {
    try {
      setLoading(true)
      setError(null)
      
      // Check if calculator is already in state
      const existingCalculator = calculators.find(calc => calc.calculatorId === calculatorId)
      
      if (existingCalculator) {
        setSelectedCalculator(existingCalculator)
        return { success: true, data: existingCalculator }
      }
      
      // Fetch from database
      const { data, error } = await supabase
        .from('calculators')
        .select('*')
        .eq('calculatorId', calculatorId)
        .single()
      
      if (error) throw error
      
      setSelectedCalculator(data)
      
      return { success: true, data }
    } catch (err) {
      console.error('Error getting calculator:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Context value
  const value = {
    calculators,
    selectedCalculator,
    loading,
    error,
    setSelectedCalculator,
    createCalculator,
    updateCalculator,
    deleteCalculator,
    getCalculator,
    clearError: () => setError(null)
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

// Custom hook to use app context
export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

