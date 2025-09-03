import React, { useState } from 'react'
import { Calculator, Zap, HelpCircle, Code, Wand2, Layers } from 'lucide-react'
import AIFormulaAssistant from './AIFormulaAssistant'
import VisualFormulaBuilder from './VisualFormulaBuilder'
import { useFormula } from '../hooks/useFormula'

function FormulaBuilder({ data, onChange }) {
  const [testValues, setTestValues] = useState({})
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('code') // 'code', 'visual', or 'ai'
  const { validateFormula } = useFormula()

  const formulaTemplates = [
    {
      name: 'Simple Addition',
      formula: 'input1 + input2',
      description: 'Add two or more values'
    },
    {
      name: 'Percentage',
      formula: '(value / total) * 100',
      description: 'Calculate percentage'
    },
    {
      name: 'ROI Calculation',
      formula: '((finalValue - initialValue) / initialValue) * 100',
      description: 'Return on Investment'
    },
    {
      name: 'Mortgage Payment',
      formula: '(principal * (rate * Math.pow(1 + rate, term))) / (Math.pow(1 + rate, term) - 1)',
      description: 'Monthly mortgage payment'
    },
    {
      name: 'Conditional Logic',
      formula: 'value > 1000 ? value * 0.1 : value * 0.05',
      description: 'If-then logic using ternary operator'
    }
  ]

  const availableVariables = data.inputSchema.map(input => input.id)

  const availableFunctions = [
    'Math.round()', 'Math.ceil()', 'Math.floor()', 'Math.abs()',
    'Math.max()', 'Math.min()', 'Math.pow()', 'Math.sqrt()',
    'Math.sin()', 'Math.cos()', 'Math.tan()', 'Math.log()'
  ]

  const testFormula = () => {
    if (!data.formulaLogic.trim()) {
      setError('Please enter a formula')
      return
    }

    try {
      // Create a safe evaluation context
      const variables = {}
      data.inputSchema.forEach(input => {
        variables[input.id] = parseFloat(testValues[input.id]) || 0
      })

      // Simple evaluation (in production, use a proper expression parser)
      let formula = data.formulaLogic
      
      // Replace variables
      Object.keys(variables).forEach(varName => {
        const regex = new RegExp(`\\b${varName}\\b`, 'g')
        formula = formula.replace(regex, variables[varName])
      })

      // Evaluate the formula
      const calculatedResult = Function(`"use strict"; return (${formula})`)()
      
      setResult(calculatedResult)
      setError('')
    } catch (err) {
      setError(`Formula error: ${err.message}`)
      setResult(null)
    }
  }

  const insertTemplate = (template) => {
    onChange({
      ...data,
      formulaLogic: template.formula
    })
  }

  const insertFunction = (func) => {
    const textarea = document.getElementById('formula-input')
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const text = data.formulaLogic
      const newText = text.substring(0, start) + func + text.substring(end)
      
      onChange({
        ...data,
        formulaLogic: newText
      })
      
      // Restore cursor position
      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start + func.length - 1, start + func.length - 1)
      }, 0)
    }
  }

  const handleApplyAIFormula = (formula) => {
    onChange({
      ...data,
      formulaLogic: formula
    })
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Formula Builder</h2>
        <p className="text-text-secondary">Define the calculation logic for your calculator using JavaScript expressions.</p>
      </div>

      {/* Builder Tabs */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 font-medium text-sm flex items-center ${
              activeTab === 'code'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Code className="h-4 w-4 mr-2" />
            Code Editor
          </button>
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-4 py-2 font-medium text-sm flex items-center ${
              activeTab === 'visual'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Layers className="h-4 w-4 mr-2" />
            Visual Builder
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2 font-medium text-sm flex items-center ${
              activeTab === 'ai'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Wand2 className="h-4 w-4 mr-2" />
            AI Assistant
          </button>
        </div>
      </div>

      {/* Active Tab Content */}
      {activeTab === 'code' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formula Editor */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Formula Editor</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Formula Logic
                  </label>
                  <textarea
                    id="formula-input"
                    value={data.formulaLogic}
                    onChange={(e) => {
                      const newFormula = e.target.value
                      onChange({ ...data, formulaLogic: newFormula })
                      
                      // Clear error when typing
                      if (error) setError('')
                    }}
                    placeholder="Enter your formula using input field IDs as variables..."
                    className="input-field h-32 font-mono"
                  />
                  <p className="text-xs text-text-secondary mt-2">
                    Use input field IDs as variables. Supports JavaScript Math functions and operators.
                  </p>
                </div>

                {availableVariables.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Available Variables
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableVariables.map(variable => (
                        <span
                          key={variable}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-mono cursor-pointer hover:bg-primary/20 transition-colors"
                          onClick={() => {
                            const textarea = document.getElementById('formula-input')
                            if (textarea) {
                              const start = textarea.selectionStart
                              const end = textarea.selectionEnd
                              const text = data.formulaLogic
                              const newText = text.substring(0, start) + variable + text.substring(end)
                              onChange({ ...data, formulaLogic: newText })
                            }
                          }}
                        >
                          {variable}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Test Section */}
            <div className="card">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Test Your Formula</h3>
              
              <div className="space-y-4">
                {data.inputSchema.map(input => (
                  <div key={input.id} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        {input.label} ({input.id})
                      </label>
                      <input
                        type="number"
                        value={testValues[input.id] || ''}
                        onChange={(e) => setTestValues({ ...testValues, [input.id]: e.target.value })}
                        placeholder="Enter test value"
                        className="input-field"
                      />
                    </div>
                  </div>
                ))}
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={testFormula}
                    className="btn-primary flex items-center space-x-2"
                    disabled={!data.formulaLogic.trim() || data.inputSchema.length === 0}
                  >
                    <Calculator className="h-4 w-4" />
                    <span>Test Formula</span>
                  </button>
                  
                  {result !== null && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-text-secondary">Result:</span>
                      <span className="text-lg font-semibold text-accent">{result}</span>
                    </div>
                  )}
                  
                  {error && (
                    <div className="text-sm text-red-600">{error}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Formula Templates */}
            <div className="card">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Formula Templates</h3>
              <div className="space-y-3">
                {formulaTemplates.map((template, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer">
                    <div onClick={() => insertTemplate(template)}>
                      <h4 className="font-medium text-text-primary mb-1">{template.name}</h4>
                      <p className="text-xs text-text-secondary mb-2">{template.description}</p>
                      <code className="text-xs text-primary bg-primary/10 px-2 py-1 rounded font-mono">
                        {template.formula}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Functions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Math Functions</h3>
              <div className="grid grid-cols-2 gap-2">
                {availableFunctions.map((func, index) => (
                  <button
                    key={index}
                    onClick={() => insertFunction(func)}
                    className="text-xs px-2 py-1 bg-gray-100 text-text-primary rounded hover:bg-gray-200 transition-colors font-mono"
                  >
                    {func}
                  </button>
                ))}
              </div>
            </div>

            {/* Help */}
            <div className="card">
              <div className="flex items-center space-x-2 mb-3">
                <HelpCircle className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-text-primary">Formula Help</h3>
              </div>
              <div className="text-sm text-text-secondary space-y-2">
                <p><strong>Basic operators:</strong> +, -, *, /, %</p>
                <p><strong>Comparison:</strong> >, <, >=, <=, ==, !=</p>
                <p><strong>Conditional:</strong> condition ? valueIfTrue : valueIfFalse</p>
                <p><strong>Grouping:</strong> Use parentheses ( )</p>
                <p><strong>Variables:</strong> Use input field IDs</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'visual' && (
        <VisualFormulaBuilder data={data} onChange={onChange} />
      )}

      {activeTab === 'ai' && (
        <AIFormulaAssistant data={data} onApplyFormula={handleApplyAIFormula} />
      )}
    </div>
  )
}

export default FormulaBuilder
