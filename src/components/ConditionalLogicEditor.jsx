import React, { useState } from 'react'
import { Plus, Trash2, ArrowRight } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

function ConditionalLogicEditor({ input, allInputs, onUpdate }) {
  const [conditions, setConditions] = useState(input.conditions || [])

  const addCondition = () => {
    const newCondition = {
      id: uuidv4(),
      dependsOn: allInputs[0]?.id || '',
      operator: 'equals',
      value: '',
      action: 'show'
    }
    
    const updatedConditions = [...conditions, newCondition]
    setConditions(updatedConditions)
    
    onUpdate({
      ...input,
      conditions: updatedConditions
    })
  }

  const updateCondition = (conditionId, updates) => {
    const updatedConditions = conditions.map(condition =>
      condition.id === conditionId ? { ...condition, ...updates } : condition
    )
    
    setConditions(updatedConditions)
    
    onUpdate({
      ...input,
      conditions: updatedConditions
    })
  }

  const removeCondition = (conditionId) => {
    const updatedConditions = conditions.filter(condition => condition.id !== conditionId)
    
    setConditions(updatedConditions)
    
    onUpdate({
      ...input,
      conditions: updatedConditions
    })
  }

  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Does not equal' },
    { value: 'greater_than', label: 'Greater than' },
    { value: 'less_than', label: 'Less than' },
    { value: 'contains', label: 'Contains' },
    { value: 'starts_with', label: 'Starts with' },
    { value: 'ends_with', label: 'Ends with' },
    { value: 'is_empty', label: 'Is empty' },
    { value: 'is_not_empty', label: 'Is not empty' }
  ]

  const actions = [
    { value: 'show', label: 'Show this field' },
    { value: 'hide', label: 'Hide this field' },
    { value: 'require', label: 'Make required' },
    { value: 'optional', label: 'Make optional' }
  ]

  // Filter out the current input from the dependency options
  const dependencyOptions = allInputs.filter(i => i.id !== input.id)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-text-primary">Conditional Logic</h4>
        <button
          onClick={addCondition}
          className="text-primary hover:text-primary/80 text-sm font-medium flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Condition
        </button>
      </div>
      
      {conditions.length === 0 ? (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-center">
          <p className="text-text-secondary text-sm">
            No conditions set. This field will always be visible.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {conditions.map((condition) => (
            <div key={condition.id} className="p-4 border border-gray-200 rounded-md">
              <div className="flex justify-between items-start">
                <div className="space-y-4 flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        If field
                      </label>
                      <select
                        value={condition.dependsOn}
                        onChange={(e) => updateCondition(condition.id, { dependsOn: e.target.value })}
                        className="input-field"
                      >
                        {dependencyOptions.length === 0 ? (
                          <option value="">No other fields available</option>
                        ) : (
                          dependencyOptions.map((depInput) => (
                            <option key={depInput.id} value={depInput.id}>
                              {depInput.label}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        Operator
                      </label>
                      <select
                        value={condition.operator}
                        onChange={(e) => updateCondition(condition.id, { operator: e.target.value })}
                        className="input-field"
                      >
                        {operators.map((op) => (
                          <option key={op.value} value={op.value}>
                            {op.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {condition.operator !== 'is_empty' && condition.operator !== 'is_not_empty' && (
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        Value
                      </label>
                      <input
                        type="text"
                        value={condition.value}
                        onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                        className="input-field"
                        placeholder="Enter comparison value"
                      />
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Then
                    </label>
                    <select
                      value={condition.action}
                      onChange={(e) => updateCondition(condition.id, { action: e.target.value })}
                      className="input-field"
                    >
                      {actions.map((action) => (
                        <option key={action.value} value={action.value}>
                          {action.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <button
                  onClick={() => removeCondition(condition.id)}
                  className="ml-4 p-1 text-text-secondary hover:text-red-600 transition-colors"
                  title="Remove Condition"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              
              {/* Condition Preview */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center text-sm text-text-secondary">
                  <span>If</span>
                  <span className="font-medium text-text-primary mx-1">
                    {dependencyOptions.find(i => i.id === condition.dependsOn)?.label || 'Field'}
                  </span>
                  <span>{operators.find(op => op.value === condition.operator)?.label.toLowerCase() || 'equals'}</span>
                  {condition.operator !== 'is_empty' && condition.operator !== 'is_not_empty' && (
                    <span className="font-medium text-text-primary mx-1">
                      "{condition.value}"
                    </span>
                  )}
                  <ArrowRight className="h-3 w-3 mx-1" />
                  <span>{actions.find(a => a.value === condition.action)?.label.toLowerCase() || 'show this field'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ConditionalLogicEditor

