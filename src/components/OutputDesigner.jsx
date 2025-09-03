import React, { useState } from 'react'
import { Plus, Trash2, Settings, Palette } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

function OutputDesigner({ data, onChange }) {
  const [showAddOutput, setShowAddOutput] = useState(false)
  const [showStyleEditor, setShowStyleEditor] = useState(false)
  const [selectedOutput, setSelectedOutput] = useState(null)

  const outputTypes = [
    { id: 'number', label: 'Number', description: 'Display a numeric result' },
    { id: 'currency', label: 'Currency', description: 'Display a monetary value' },
    { id: 'percentage', label: 'Percentage', description: 'Display a percentage value' },
    { id: 'text', label: 'Text', description: 'Display a text result' },
    { id: 'boolean', label: 'Yes/No', description: 'Display a boolean result' }
  ]

  const addOutput = (type) => {
    const newOutput = {
      id: uuidv4(),
      label: `New ${type} output`,
      type: type,
      format: type === 'currency' ? 'USD' : type === 'number' ? '0,0.00' : '',
      style: {
        textColor: '#000000',
        backgroundColor: '#f0f9ff',
        fontSize: 'large',
        fontWeight: 'bold',
        borderColor: '#bae6fd'
      }
    }

    onChange({
      ...data,
      outputSchema: [...data.outputSchema, newOutput]
    })
    setShowAddOutput(false)
  }

  const updateOutput = (outputId, updates) => {
    const updatedOutputs = data.outputSchema.map(output =>
      output.id === outputId ? { ...output, ...updates } : output
    )
    onChange({ ...data, outputSchema: updatedOutputs })
  }

  const removeOutput = (outputId) => {
    const updatedOutputs = data.outputSchema.filter(output => output.id !== outputId)
    onChange({ ...data, outputSchema: updatedOutputs })
    
    if (selectedOutput?.id === outputId) {
      setSelectedOutput(null)
      setShowStyleEditor(false)
    }
  }

  const handleStyleChange = (property, value) => {
    if (!selectedOutput) return
    
    const updatedStyle = {
      ...selectedOutput.style,
      [property]: value
    }
    
    updateOutput(selectedOutput.id, { style: updatedStyle })
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Output Design</h2>
        <p className="text-text-secondary">Design how your calculator results will be displayed to users.</p>
      </div>

      {/* Add Output Button */}
      <div className="mb-6">
        {!showAddOutput ? (
          <button
            onClick={() => setShowAddOutput(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Output Field</span>
          </button>
        ) : (
          <div className="card">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Choose Output Type</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {outputTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => addOutput(type.id)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
                >
                  <div className="font-medium text-text-primary mb-2">{type.label}</div>
                  <p className="text-sm text-text-secondary">{type.description}</p>
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowAddOutput(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Output Fields List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {data.outputSchema.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">Output Fields</h3>
              
              {data.outputSchema.map((output) => (
                <div 
                  key={output.id} 
                  className={`card border-2 ${
                    selectedOutput?.id === output.id ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-4 flex-1">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Label
                        </label>
                        <input
                          type="text"
                          value={output.label}
                          onChange={(e) => updateOutput(output.id, { label: e.target.value })}
                          className="input-field"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            Type
                          </label>
                          <select
                            value={output.type}
                            onChange={(e) => updateOutput(output.id, { type: e.target.value })}
                            className="input-field"
                          >
                            {outputTypes.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        {(output.type === 'currency' || output.type === 'number') && (
                          <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                              {output.type === 'currency' ? 'Currency' : 'Format'}
                            </label>
                            {output.type === 'currency' ? (
                              <select
                                value={output.format}
                                onChange={(e) => updateOutput(output.id, { format: e.target.value })}
                                className="input-field"
                              >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="JPY">JPY (¥)</option>
                              </select>
                            ) : (
                              <select
                                value={output.format}
                                onChange={(e) => updateOutput(output.id, { format: e.target.value })}
                                className="input-field"
                              >
                                <option value="0,0">Whole number (1,234)</option>
                                <option value="0,0.0">1 decimal (1,234.5)</option>
                                <option value="0,0.00">2 decimals (1,234.56)</option>
                                <option value="0,0.000">3 decimals (1,234.567)</option>
                              </select>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => {
                          setSelectedOutput(output)
                          setShowStyleEditor(true)
                        }}
                        className="p-2 text-text-secondary hover:text-primary transition-colors"
                        title="Style Settings"
                      >
                        <Palette className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => removeOutput(output.id)}
                        className="p-2 text-text-secondary hover:text-red-600 transition-colors"
                        title="Remove Output"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Output Preview */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-secondary">Preview:</span>
                      <div 
                        className="px-4 py-2 rounded-md" 
                        style={{
                          backgroundColor: output.style?.backgroundColor || '#f0f9ff',
                          color: output.style?.textColor || '#000000',
                          fontSize: output.style?.fontSize === 'small' ? '0.875rem' : 
                                   output.style?.fontSize === 'large' ? '1.25rem' : '1rem',
                          fontWeight: output.style?.fontWeight === 'bold' ? 'bold' : 'normal',
                          border: `1px solid ${output.style?.borderColor || '#bae6fd'}`
                        }}
                      >
                        {output.type === 'currency' && '$1,234.56'}
                        {output.type === 'percentage' && '12.34%'}
                        {output.type === 'number' && '1,234.56'}
                        {output.type === 'text' && 'Sample Text'}
                        {output.type === 'boolean' && 'Yes'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <Settings className="h-12 w-12 text-text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">No output fields yet</h3>
              <p className="text-text-secondary">Add output fields to display your calculation results</p>
            </div>
          )}
        </div>
        
        {/* Style Editor */}
        {showStyleEditor && selectedOutput && (
          <div className="card">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Style Editor</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Text Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={selectedOutput.style?.textColor || '#000000'}
                    onChange={(e) => handleStyleChange('textColor', e.target.value)}
                    className="h-8 w-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={selectedOutput.style?.textColor || '#000000'}
                    onChange={(e) => handleStyleChange('textColor', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Background Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={selectedOutput.style?.backgroundColor || '#f0f9ff'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    className="h-8 w-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={selectedOutput.style?.backgroundColor || '#f0f9ff'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Border Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={selectedOutput.style?.borderColor || '#bae6fd'}
                    onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                    className="h-8 w-8 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={selectedOutput.style?.borderColor || '#bae6fd'}
                    onChange={(e) => handleStyleChange('borderColor', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Font Size
                </label>
                <select
                  value={selectedOutput.style?.fontSize || 'medium'}
                  onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                  className="input-field"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Font Weight
                </label>
                <select
                  value={selectedOutput.style?.fontWeight || 'normal'}
                  onChange={(e) => handleStyleChange('fontWeight', e.target.value)}
                  className="input-field"
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                </select>
              </div>
              
              <div className="pt-4 mt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setSelectedOutput(null)
                    setShowStyleEditor(false)
                  }}
                  className="btn-secondary w-full"
                >
                  Close Style Editor
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OutputDesigner

