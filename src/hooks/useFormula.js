import { useState } from 'react'
import { useSubscription } from './useSubscription'
import { generateFormula, explainFormula, debugFormula } from '../lib/openai'

export function useFormula() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { hasAccess } = useSubscription()

  // Generate a formula from natural language
  const generateFormulaFromText = async (description, inputFields) => {
    try {
      // Check if user has access to AI assistant
      if (!hasAccess('aiAssistant')) {
        throw new Error('AI formula assistance requires a Pro or Business subscription')
      }
      
      setLoading(true)
      setError(null)
      
      const result = await generateFormula(description, inputFields)
      
      return result
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Get explanation for a formula
  const getFormulaExplanation = async (formula, inputFields) => {
    try {
      // Check if user has access to AI assistant
      if (!hasAccess('aiAssistant')) {
        throw new Error('AI formula assistance requires a Pro or Business subscription')
      }
      
      setLoading(true)
      setError(null)
      
      const explanation = await explainFormula(formula, inputFields)
      
      return explanation
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Debug a formula
  const debugFormulaWithAI = async (formula, errorMessage, inputFields) => {
    try {
      // Check if user has access to AI assistant
      if (!hasAccess('aiAssistant')) {
        throw new Error('AI formula assistance requires a Pro or Business subscription')
      }
      
      setLoading(true)
      setError(null)
      
      const result = await debugFormula(formula, errorMessage, inputFields)
      
      return result
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Validate a formula
  const validateFormula = (formula, inputFields) => {
    if (!formula.trim()) {
      return { isValid: false, error: 'Formula cannot be empty' }
    }
    
    try {
      // Create a safe evaluation context with dummy values
      const variables = {}
      inputFields.forEach(input => {
        variables[input.id] = input.type === 'number' || input.type === 'range' ? 1 : 'test'
      })
      
      // Replace variables in formula
      let testFormula = formula
      Object.keys(variables).forEach(varName => {
        const regex = new RegExp(`\\b${varName}\\b`, 'g')
        testFormula = testFormula.replace(regex, variables[varName])
      })
      
      // Try to evaluate the formula
      Function(`"use strict"; return (${testFormula})`)()
      
      return { isValid: true, error: null }
    } catch (err) {
      return { isValid: false, error: err.message }
    }
  }

  return {
    loading,
    error,
    generateFormulaFromText,
    getFormulaExplanation,
    debugFormulaWithAI,
    validateFormula,
    clearError: () => setError(null)
  }
}

