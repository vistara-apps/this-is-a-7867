import React, { useState } from 'react'
import { AlertCircle, Check, X } from 'lucide-react'

function ValidationRulesEditor({ input, onUpdate }) {
  const [validationRules, setValidationRules] = useState({
    required: input.required || false,
    min: input.min || '',
    max: input.max || '',
    pattern: input.pattern || '',
    customError: input.customError || ''
  })

  const handleChange = (field, value) => {
    const updatedRules = {
      ...validationRules,
      [field]: value
    }
    
    setValidationRules(updatedRules)
    
    // Update the input with new validation rules
    onUpdate({
      ...input,
      ...updatedRules
    })
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-text-primary">Validation Rules</h4>
      
      <div className="flex items-center">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={validationRules.required}
            onChange={(e) => handleChange('required', e.target.checked)}
            className="sr-only"
          />
          <span className={`w-5 h-5 mr-2 flex items-center justify-center rounded border ${
            validationRules.required 
              ? 'bg-primary border-primary text-white' 
              : 'border-gray-300'
          }`}>
            {validationRules.required && <Check className="h-3 w-3" />}
          </span>
          <span className="text-text-primary">Required field</span>
        </label>
      </div>
      
      {(input.type === 'number' || input.type === 'range') && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Minimum Value
            </label>
            <input
              type="number"
              value={validationRules.min}
              onChange={(e) => handleChange('min', e.target.value)}
              placeholder="No minimum"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Maximum Value
            </label>
            <input
              type="number"
              value={validationRules.max}
              onChange={(e) => handleChange('max', e.target.value)}
              placeholder="No maximum"
              className="input-field"
            />
          </div>
        </div>
      )}
      
      {input.type === 'text' && (
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Pattern (Regex)
          </label>
          <input
            type="text"
            value={validationRules.pattern}
            onChange={(e) => handleChange('pattern', e.target.value)}
            placeholder="e.g., ^[A-Za-z0-9]+$"
            className="input-field"
          />
          <p className="text-xs text-text-secondary mt-1">
            Regular expression pattern for validation
          </p>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">
          Custom Error Message
        </label>
        <input
          type="text"
          value={validationRules.customError}
          onChange={(e) => handleChange('customError', e.target.value)}
          placeholder="e.g., Please enter a valid value"
          className="input-field"
        />
      </div>
      
      {/* Validation Preview */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="font-medium text-text-primary mb-2">Validation Preview</h4>
        
        <div className="p-3 rounded-md bg-gray-50 border border-gray-200">
          {validationRules.required && (
            <div className="flex items-start mb-2">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-red-700">
                {validationRules.customError || 'This field is required'}
              </span>
            </div>
          )}
          
          {(input.type === 'number' || input.type === 'range') && validationRules.min && validationRules.max && (
            <div className="flex items-start mb-2">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-red-700">
                {validationRules.customError || `Value must be between ${validationRules.min} and ${validationRules.max}`}
              </span>
            </div>
          )}
          
          {input.type === 'text' && validationRules.pattern && (
            <div className="flex items-start">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-red-700">
                {validationRules.customError || 'Please enter a valid format'}
              </span>
            </div>
          )}
          
          {!validationRules.required && 
           !((input.type === 'number' || input.type === 'range') && validationRules.min && validationRules.max) &&
           !(input.type === 'text' && validationRules.pattern) && (
            <div className="flex items-center text-text-secondary">
              <Check className="h-4 w-4 text-accent mr-2" />
              <span className="text-sm">No validation rules applied</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ValidationRulesEditor

