import React, { useState, useEffect } from 'react'
import { Copy, ExternalLink, Code } from 'lucide-react'

function CalculatorPreview({ data }) {
  const [values, setValues] = useState({})
  const [result, setResult] = useState(null)
  const [showEmbedCode, setShowEmbedCode] = useState(false)

  useEffect(() => {
    calculateResult()
  }, [values, data.formulaLogic])

  const calculateResult = () => {
    if (!data.formulaLogic.trim() || data.inputSchema.length === 0) {
      setResult(null)
      return
    }

    try {
      // Create evaluation context
      const variables = {}
      data.inputSchema.forEach(input => {
        const value = values[input.id]
        if (value !== undefined && value !== '') {
          variables[input.id] = input.type === 'number' || input.type === 'range'
            ? parseFloat(value) || 0
            : value
        } else {
          variables[input.id] = 0
        }
      })

      // Replace variables in formula
      let formula = data.formulaLogic
      Object.keys(variables).forEach(varName => {
        const regex = new RegExp(`\\b${varName}\\b`, 'g')
        formula = formula.replace(regex, variables[varName])
      })

      // Evaluate formula
      const calculatedResult = Function(`"use strict"; return (${formula})`)()
      
      // Format result based on output type
      let formattedResult = calculatedResult
      if (data.outputSchema[0]?.type === 'currency') {
        formattedResult = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(calculatedResult)
      } else if (data.outputSchema[0]?.type === 'percentage') {
        formattedResult = `${calculatedResult.toFixed(2)}%`
      } else if (typeof calculatedResult === 'number') {
        formattedResult = calculatedResult.toFixed(2)
      }
      
      setResult(formattedResult)
    } catch (err) {
      setResult('Error in calculation')
    }
  }

  const handleInputChange = (inputId, value) => {
    setValues({ ...values, [inputId]: value })
  }

  const copyEmbedCode = () => {
    const embedCode = `<iframe src="https://formulaflow.com/embed/${data.calculatorId || 'preview'}" width="400" height="400" frameborder="0"></iframe>`
    navigator.clipboard.writeText(embedCode)
    alert('Embed code copied to clipboard!')
  }

  const renderInput = (input) => {
    switch (input.type) {
      case 'text':
        return (
          <input
            type="text"
            value={values[input.id] || ''}
            onChange={(e) => handleInputChange(input.id, e.target.value)}
            placeholder={input.placeholder}
            required={input.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        )
      
      case 'number':
        return (
          <input
            type="number"
            value={values[input.id] || ''}
            onChange={(e) => handleInputChange(input.id, e.target.value)}
            placeholder={input.placeholder}
            min={input.min}
            max={input.max}
            step={input.step}
            required={input.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        )
      
      case 'select':
        return (
          <select
            value={values[input.id] || ''}
            onChange={(e) => handleInputChange(input.id, e.target.value)}
            required={input.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select an option</option>
            {(input.options || []).map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        )
      
      case 'range':
        return (
          <div className="space-y-2">
            <input
              type="range"
              value={values[input.id] || input.defaultValue || input.min || 0}
              onChange={(e) => handleInputChange(input.id, e.target.value)}
              min={input.min || 0}
              max={input.max || 100}
              step={input.step || 1}
              className="w-full"
            />
            <div className="text-center text-sm text-gray-600">
              {values[input.id] || input.defaultValue || input.min || 0}
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Calculator Preview</h2>
        <p className="text-text-secondary">See how your calculator will look and work for users.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Preview */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-xl font-semibold text-text-primary mb-6">
              {data.name || 'Untitled Calculator'}
            </h3>
            
            {data.inputSchema.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-text-secondary">No input fields configured yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.inputSchema.map((input) => (
                  <div key={input.id}>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      {input.label}
                      {input.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderInput(input)}
                  </div>
                ))}
                
                {/* Result Display */}
                {data.outputSchema[0] && (
                  <div className="mt-6 p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-text-primary">
                        {data.outputSchema[0].label || 'Result'}
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        {result !== null ? result : '--'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Configuration & Embed */}
        <div className="space-y-6">
          {/* Embed Options */}
          <div className="card">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Embed Options</h3>
            
            <div className="space-y-4">
              <button
                onClick={() => setShowEmbedCode(!showEmbedCode)}
                className="w-full btn-secondary flex items-center justify-center space-x-2"
              >
                <Code className="h-4 w-4" />
                <span>Get Embed Code</span>
              </button>
              
              {showEmbedCode && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Iframe Embed Code
                    </label>
                    <div className="relative">
                      <textarea
                        value={`<iframe src="https://formulaflow.com/embed/${data.calculatorId || 'preview'}" width="400" height="400" frameborder="0"></iframe>`}
                        readOnly
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md font-mono text-sm"
                        rows="3"
                      />
                      <button
                        onClick={copyEmbedCode}
                        className="absolute top-2 right-2 p-2 text-text-secondary hover:text-text-primary transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Width</label>
                      <input
                        type="number"
                        defaultValue="400"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Height</label>
                      <input
                        type="number"
                        defaultValue="400"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <button className="w-full btn-primary flex items-center justify-center space-x-2">
                <ExternalLink className="h-4 w-4" />
                <span>Open in New Window</span>
              </button>
            </div>
          </div>

          {/* Formula Info */}
          {data.formulaLogic && (
            <div className="card">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Formula Logic</h3>
              <div className="bg-gray-50 p-3 rounded-md">
                <code className="text-sm font-mono text-text-primary">
                  {data.formulaLogic}
                </code>
              </div>
            </div>
          )}

          {/* Calculator Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Calculator Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-text-secondary">Input Fields</span>
                <span className="font-medium text-text-primary">{data.inputSchema.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Output Fields</span>
                <span className="font-medium text-text-primary">{data.outputSchema.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Has Formula</span>
                <span className="font-medium text-text-primary">
                  {data.formulaLogic ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Status</span>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                  data.isPublished 
                    ? 'bg-accent/10 text-accent' 
                    : 'bg-gray-100 text-text-secondary'
                }`}>
                  {data.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalculatorPreview