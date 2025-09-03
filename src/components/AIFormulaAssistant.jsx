import React, { useState } from 'react'
import { useFormula } from '../hooks/useFormula'
import { useSubscription } from '../hooks/useSubscription'
import { Sparkles, AlertCircle, Lightbulb, Loader2, Wand2 } from 'lucide-react'

function AIFormulaAssistant({ data, onApplyFormula }) {
  const [description, setDescription] = useState('')
  const [explanation, setExplanation] = useState('')
  const [generatedFormula, setGeneratedFormula] = useState('')
  const [showExplanation, setShowExplanation] = useState(false)
  const { 
    generateFormulaFromText, 
    getFormulaExplanation,
    debugFormulaWithAI,
    loading, 
    error, 
    clearError 
  } = useFormula()
  const { hasAccess } = useSubscription()

  const handleGenerateFormula = async () => {
    if (!description.trim()) return
    
    const result = await generateFormulaFromText(description, data.inputSchema)
    
    if (result) {
      setGeneratedFormula(result.formula)
      setExplanation(result.explanation)
      setShowExplanation(true)
    }
  }

  const handleExplainCurrentFormula = async () => {
    if (!data.formulaLogic.trim()) return
    
    const result = await getFormulaExplanation(data.formulaLogic, data.inputSchema)
    
    if (result) {
      setExplanation(result)
      setShowExplanation(true)
    }
  }

  const handleDebugFormula = async () => {
    if (!data.formulaLogic.trim()) return
    
    // For this example, we'll use a generic error message
    // In a real implementation, you would pass the actual error message
    const result = await debugFormulaWithAI(
      data.formulaLogic, 
      'Syntax error in formula', 
      data.inputSchema
    )
    
    if (result) {
      setGeneratedFormula(result.fixedFormula)
      setExplanation(result.explanation)
      setShowExplanation(true)
    }
  }

  const handleApplyFormula = () => {
    onApplyFormula(generatedFormula)
    setGeneratedFormula('')
    setExplanation('')
    setShowExplanation(false)
  }

  // Check if user has access to AI features
  if (!hasAccess('aiAssistant')) {
    return (
      <div className="card bg-gray-50 border border-gray-200">
        <div className="text-center py-6">
          <Sparkles className="h-8 w-8 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-text-primary mb-2">AI Formula Assistant</h3>
          <p className="text-text-secondary mb-4">
            Generate formulas from natural language descriptions with our AI assistant.
          </p>
          <p className="text-sm text-primary mb-4">
            Available on Pro and Business plans
          </p>
          <a href="/pricing" className="btn-primary inline-flex items-center">
            <Wand2 className="h-4 w-4 mr-2" />
            Upgrade to Access
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-text-primary">AI Formula Assistant</h3>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-red-700">{error}</p>
            <button 
              onClick={clearError}
              className="text-xs text-red-700 underline mt-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Describe your formula in plain language
          </label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              clearError()
            }}
            placeholder="E.g., Calculate the monthly payment for a mortgage based on principal, interest rate, and term in years"
            className="input-field h-24"
          />
          <p className="text-xs text-text-secondary mt-1">
            Be specific about what inputs to use and how they should be processed
          </p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleGenerateFormula}
            disabled={loading || !description.trim()}
            className="btn-primary flex-1 flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Formula
              </>
            )}
          </button>
          
          <button
            onClick={handleExplainCurrentFormula}
            disabled={loading || !data.formulaLogic.trim()}
            className="btn-secondary flex items-center"
          >
            <Lightbulb className="h-4 w-4 mr-2" />
            Explain Current
          </button>
          
          <button
            onClick={handleDebugFormula}
            disabled={loading || !data.formulaLogic.trim()}
            className="btn-secondary flex items-center"
          >
            <span className="mr-2">🐞</span>
            Debug
          </button>
        </div>

        {generatedFormula && (
          <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-md">
            <h4 className="font-medium text-text-primary mb-2">Generated Formula</h4>
            <pre className="bg-white p-3 rounded border border-gray-200 text-sm font-mono overflow-x-auto">
              {generatedFormula}
            </pre>
            <button
              onClick={handleApplyFormula}
              className="mt-3 text-primary hover:text-primary/80 text-sm font-medium"
            >
              Apply this formula
            </button>
          </div>
        )}

        {showExplanation && explanation && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <h4 className="font-medium text-text-primary">Explanation</h4>
            </div>
            <p className="text-sm text-text-secondary">{explanation}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AIFormulaAssistant

