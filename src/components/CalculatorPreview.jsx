import React, { useState, useEffect } from 'react'
import { trackEvent, EVENT_TYPES } from '../lib/analytics'
import LeadCaptureForm from './LeadCaptureForm'
import { useSubscription } from '../hooks/useSubscription'

function CalculatorPreview({ data, showLeadCapture = false }) {
  const [inputValues, setInputValues] = useState({})
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [interacted, setInteracted] = useState(false)
  const [completed, setCompleted] = useState(false)
  const { hasAccess } = useSubscription()

  // Initialize input values with defaults
  useEffect(() => {
    const initialValues = {}
    data.inputSchema.forEach(input => {
      if (input.defaultValue !== undefined && input.defaultValue !== '') {
        initialValues[input.id] = input.defaultValue
      } else if (input.type === 'checkbox') {
        initialValues[input.id] = input.defaultChecked || false
      } else if (input.type === 'range') {
        initialValues[input.id] = input.min || 0
      }
    })
    setInputValues(initialValues)
  }, [data.inputSchema])

  // Track view event
  useEffect(() => {
    if (data.calculatorId) {
      trackEvent(data.calculatorId, EVENT_TYPES.VIEW)
    }
  }, [data.calculatorId])

  const handleInputChange = (inputId, value) => {
    setInputValues(prev => ({
      ...prev,
      [inputId]: value
    }))
    
    // Track interaction event (only once)
    if (!interacted && data.calculatorId) {
      trackEvent(data.calculatorId, EVENT_TYPES.INTERACTION)
      setInteracted(true)
    }
  }

  const calculateResult = () => {
    try {
      setError(null)
      
      // Check if all required inputs have values
      const missingInputs = data.inputSchema
        .filter(input => input.required)
        .filter(input => inputValues[input.id] === undefined || inputValues[input.id] === '')
      
      if (missingInputs.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingInputs.map(i => i.label).join(', ')}`)
      }
      
      // Create a safe evaluation context
      const variables = {}
      data.inputSchema.forEach(input => {
        if (input.type === 'number' || input.type === 'range') {
          variables[input.id] = parseFloat(inputValues[input.id]) || 0
        } else if (input.type === 'checkbox') {
          variables[input.id] = !!inputValues[input.id]
        } else {
          variables[input.id] = inputValues[input.id] || ''
        }
      })
      
      // Evaluate the formula
      let formula = data.formulaLogic
      
      // Replace variables
      Object.keys(variables).forEach(varName => {
        const regex = new RegExp(`\\b${varName}\\b`, 'g')
        const value = typeof variables[varName] === 'string' 
          ? `"${variables[varName]}"` 
          : variables[varName]
        formula = formula.replace(regex, value)
      })
      
      // Calculate result
      const calculatedResult = Function(`"use strict"; return (${formula})`)()
      
      // Format result based on output type
      const output = data.outputSchema[0] || { type: 'number' }
      let formattedResult = calculatedResult
      
      if (output.type === 'currency') {
        formattedResult = new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: output.format || 'USD' 
        }).format(calculatedResult)
      } else if (output.type === 'percentage') {
        formattedResult = `${calculatedResult.toFixed(2)}%`
      } else if (output.type === 'number') {
        const format = output.format || '0,0.00'
        const decimals = format.split('.')[1]?.length || 2
        formattedResult = calculatedResult.toLocaleString('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        })
      }
      
      setResult(formattedResult)
      
      // Track completion event
      if (data.calculatorId) {
        trackEvent(data.calculatorId, EVENT_TYPES.COMPLETION, { result: formattedResult })
        setCompleted(true)
      }
    } catch (err) {
      console.error('Calculation error:', err)
      setError(err.message)
      setResult(null)
      
      // Track error event
      if (data.calculatorId) {
        trackEvent(data.calculatorId, EVENT_TYPES.ERROR, { error: err.message })
      }
    }
  }

  // Apply styling based on calculator style settings
  const getStyles = () => {
    const style = data.style || {}
    const colors = style.colors || {}
    const layout = style.layout || {}
    const typography = style.typography || {}
    
    return {
      container: {
        fontFamily: 
          typography.fontFamily === 'sans' ? 'ui-sans-serif, system-ui, sans-serif' :
          typography.fontFamily === 'serif' ? 'ui-serif, Georgia, serif' :
          typography.fontFamily === 'mono' ? 'ui-monospace, monospace' : 'inherit',
        fontSize:
          typography.fontSize === 'small' ? '0.875rem' :
          typography.fontSize === 'medium' ? '1rem' :
          typography.fontSize === 'large' ? '1.125rem' : '1rem',
        backgroundColor: colors.background || '#ffffff',
        color: colors.text || '#1e293b',
        borderRadius: 
          layout.borderRadius === 'none' ? '0' :
          layout.borderRadius === 'small' ? '0.25rem' :
          layout.borderRadius === 'medium' ? '0.5rem' :
          layout.borderRadius === 'large' ? '0.75rem' :
          layout.borderRadius === 'full' ? '1rem' : '0.5rem',
        padding:
          layout.padding === 'small' ? '1rem' :
          layout.padding === 'medium' ? '1.5rem' :
          layout.padding === 'large' ? '2rem' : '1.5rem',
        textAlign: layout.alignment || 'left',
        border: `1px solid ${colors.border || '#e2e8f0'}`
      },
      heading: {
        color: colors.text || '#1e293b',
        fontWeight:
          typography.headingStyle === 'light' ? '300' :
          typography.headingStyle === 'regular' ? '400' :
          typography.headingStyle === 'bold' ? '700' :
          typography.headingStyle === 'extra-bold' ? '800' : '700'
      },
      input: {
        borderWidth: '1px',
        borderStyle: 
          typography.inputStyle === 'underline' ? 'none' : 'solid',
        borderColor: colors.border || '#e2e8f0',
        borderBottomWidth: 
          typography.inputStyle === 'underline' ? '1px' : undefined,
        borderBottomStyle: 
          typography.inputStyle === 'underline' ? 'solid' : undefined,
        borderBottomColor: 
          typography.inputStyle === 'underline' ? (colors.primary || '#3b82f6') : undefined,
        backgroundColor: 
          typography.inputStyle === 'filled' ? '#f9fafb' : 
          typography.inputStyle === 'minimal' ? 'transparent' : 'white',
        color: colors.text || '#1e293b'
      },
      button: {
        backgroundColor: colors.primary || '#3b82f6',
        color: 'white',
        border: 'none',
        cursor: 'pointer'
      },
      result: {
        backgroundColor: `${colors.primary || '#3b82f6'}10`,
        borderLeft: `4px solid ${colors.primary || '#3b82f6'}`,
        color: colors.text || '#1e293b'
      }
    }
  }

  const styles = getStyles()

  return (
    <div className="max-w-2xl mx-auto">
      <div style={styles.container} className="rounded-lg shadow-sm">
        <div className="mb-6">
          <h2 style={styles.heading} className="text-2xl mb-2">
            {data.name || 'Calculator'}
          </h2>
          {data.description && (
            <p className="text-text-secondary">
              {data.description}
            </p>
          )}
        </div>
        
        <div className="space-y-4 mb-6">
          {data.inputSchema.map((input) => (
            <div key={input.id}>
              <label className="block text-sm font-medium mb-1">
                {input.label}
                {input.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {input.type === 'text' && (
                <input
                  type="text"
                  value={inputValues[input.id] || ''}
                  onChange={(e) => handleInputChange(input.id, e.target.value)}
                  placeholder={input.placeholder || ''}
                  style={styles.input}
                  className="w-full px-3 py-2 rounded-md"
                  required={input.required}
                />
              )}
              
              {input.type === 'number' && (
                <input
                  type="number"
                  value={inputValues[input.id] || ''}
                  onChange={(e) => handleInputChange(input.id, e.target.value)}
                  placeholder={input.placeholder || ''}
                  min={input.min}
                  max={input.max}
                  step={input.step || 'any'}
                  style={styles.input}
                  className="w-full px-3 py-2 rounded-md"
                  required={input.required}
                />
              )}
              
              {input.type === 'select' && (
                <select
                  value={inputValues[input.id] || ''}
                  onChange={(e) => handleInputChange(input.id, e.target.value)}
                  style={styles.input}
                  className="w-full px-3 py-2 rounded-md"
                  required={input.required}
                >
                  <option value="">Select an option</option>
                  {input.options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
              
              {input.type === 'range' && (
                <div>
                  <input
                    type="range"
                    value={inputValues[input.id] || input.min || 0}
                    onChange={(e) => handleInputChange(input.id, e.target.value)}
                    min={input.min || 0}
                    max={input.max || 100}
                    step={input.step || 1}
                    className="w-full"
                    required={input.required}
                  />
                  <div className="flex justify-between text-xs text-text-secondary mt-1">
                    <span>{input.min || 0}</span>
                    <span>{inputValues[input.id] || input.min || 0}</span>
                    <span>{input.max || 100}</span>
                  </div>
                </div>
              )}
              
              {input.type === 'checkbox' && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={!!inputValues[input.id]}
                    onChange={(e) => handleInputChange(input.id, e.target.checked)}
                    className="h-4 w-4 text-primary rounded border-gray-300"
                    required={input.required}
                  />
                  <span className="ml-2 text-sm text-text-secondary">
                    {input.placeholder || 'Yes'}
                  </span>
                </div>
              )}
              
              {input.type === 'date' && (
                <input
                  type="date"
                  value={inputValues[input.id] || ''}
                  onChange={(e) => handleInputChange(input.id, e.target.value)}
                  min={input.minDate}
                  max={input.maxDate}
                  style={styles.input}
                  className="w-full px-3 py-2 rounded-md"
                  required={input.required}
                />
              )}
            </div>
          ))}
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        
        <button
          onClick={calculateResult}
          style={styles.button}
          className="w-full py-2 px-4 rounded-md font-medium"
        >
          Calculate
        </button>
        
        {result !== null && (
          <div className="mt-6">
            {showLeadCapture && hasAccess('leadCapture') && completed ? (
              <LeadCaptureForm
                calculator={data}
                result={result}
                onSuccess={() => {}}
              />
            ) : (
              <div style={styles.result} className="p-4 rounded-md mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">
                    {data.outputSchema[0]?.label || 'Result'}:
                  </span>
                  <span 
                    className="text-xl font-bold"
                    style={{ color: styles.container.color }}
                  >
                    {result}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CalculatorPreview

