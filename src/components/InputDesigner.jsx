import React, { useState } from 'react'
import { Plus, Trash2, GripVertical, Type, Hash, List, ToggleLeft, Settings, Sliders, AlertTriangle } from 'lucide-react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import SortableInputItem from './SortableInputItem'
import ValidationRulesEditor from './ValidationRulesEditor'
import ConditionalLogicEditor from './ConditionalLogicEditor'
import OutputDesigner from './OutputDesigner'
import StyleEditor from './StyleEditor'
import { v4 as uuidv4 } from 'uuid'
import { useSubscription } from '../hooks/useSubscription'

function InputDesigner({ data, onChange }) {
  const [showAddInput, setShowAddInput] = useState(false)
  const [selectedInput, setSelectedInput] = useState(null)
  const [activeTab, setActiveTab] = useState('inputs') // 'inputs', 'outputs', 'style'
  const [activeSettingsTab, setActiveSettingsTab] = useState('validation') // 'validation', 'conditional'
  const { hasAccess } = useSubscription()
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const inputTypes = [
    { id: 'text', label: 'Text Input', icon: Type, description: 'Single line text field' },
    { id: 'number', label: 'Number Input', icon: Hash, description: 'Numeric input with validation' },
    { id: 'select', label: 'Dropdown', icon: List, description: 'Select from predefined options' },
    { id: 'range', label: 'Slider', icon: ToggleLeft, description: 'Range slider input' },
    { id: 'checkbox', label: 'Checkbox', icon: Settings, description: 'Boolean true/false input' },
    { id: 'date', label: 'Date Picker', icon: Settings, description: 'Date selection input' }
  ]

  const addInput = (type) => {
    const newInput = {
      id: uuidv4(),
      label: `New ${type} input`,
      type: type,
      required: true,
      placeholder: '',
      defaultValue: '',
      ...(type === 'select' && { options: ['Option 1', 'Option 2'] }),
      ...(type === 'range' && { min: 0, max: 100, step: 1 }),
      ...(type === 'number' && { min: '', max: '', step: '' }),
      ...(type === 'checkbox' && { defaultChecked: false }),
      ...(type === 'date' && { minDate: '', maxDate: '' })
    }

    const updatedInputs = [...data.inputSchema, newInput]
    onChange({
      ...data,
      inputSchema: updatedInputs
    })
    setShowAddInput(false)
    setSelectedInput(newInput)
  }

  const updateInput = (inputId, updates) => {
    const updatedInputs = data.inputSchema.map(input =>
      input.id === inputId ? { ...input, ...updates } : input
    )
    onChange({ ...data, inputSchema: updatedInputs })
    
    // Update selected input if it's the one being modified
    if (selectedInput && selectedInput.id === inputId) {
      setSelectedInput({ ...selectedInput, ...updates })
    }
  }

  const removeInput = (inputId) => {
    const updatedInputs = data.inputSchema.filter(input => input.id !== inputId)
    onChange({ ...data, inputSchema: updatedInputs })
    
    if (selectedInput && selectedInput.id === inputId) {
      setSelectedInput(null)
    }
  }

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = data.inputSchema.findIndex(input => input.id === active.id)
      const newIndex = data.inputSchema.findIndex(input => input.id === over.id)
      
      const reorderedInputs = arrayMove(data.inputSchema, oldIndex, newIndex)
      onChange({ ...data, inputSchema: reorderedInputs })
    }
  }

  const handleInputClick = (input) => {
    setSelectedInput(input)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Calculator Design</h2>
        <p className="text-text-secondary">Design the input fields, output display, and styling for your calculator.</p>
      </div>

      {/* Design Tabs */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('inputs')}
            className={`px-4 py-2 font-medium text-sm flex items-center ${
              activeTab === 'inputs'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Type className="h-4 w-4 mr-2" />
            Input Fields
          </button>
          <button
            onClick={() => setActiveTab('outputs')}
            className={`px-4 py-2 font-medium text-sm flex items-center ${
              activeTab === 'outputs'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Hash className="h-4 w-4 mr-2" />
            Output Display
          </button>
          <button
            onClick={() => setActiveTab('style')}
            className={`px-4 py-2 font-medium text-sm flex items-center ${
              activeTab === 'style'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Sliders className="h-4 w-4 mr-2" />
            Styling
          </button>
        </div>
      </div>

      {/* Input Fields Tab */}
      {activeTab === 'inputs' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Fields List */}
          <div className="lg:col-span-2">
            {/* Add Input Button */}
            <div className="mb-6">
              {!showAddInput ? (
                <button
                  onClick={() => setShowAddInput(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Input Field</span>
                </button>
              ) : (
                <div className="card">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">Choose Input Type</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {inputTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => addInput(type.id)}
                        className="p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <type.icon className="h-5 w-5 text-primary" />
                          <span className="font-medium text-text-primary">{type.label}</span>
                        </div>
                        <p className="text-sm text-text-secondary">{type.description}</p>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setShowAddInput(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {data.inputSchema.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">Input Fields</h3>
                
                <DndContext 
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToVerticalAxis]}
                >
                  <SortableContext 
                    items={data.inputSchema.map(input => input.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4">
                      {data.inputSchema.map((input) => (
                        <div 
                          key={input.id}
                          onClick={() => handleInputClick(input)}
                          className={`cursor-pointer ${selectedInput?.id === input.id ? 'ring-2 ring-primary' : ''}`}
                        >
                          <SortableInputItem
                            input={input}
                            onUpdate={updateInput}
                            onRemove={removeInput}
                          />
                        </div>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            ) : (
              <div className="card text-center py-12">
                <Type className="h-12 w-12 text-text-secondary mx-auto mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-2">No input fields yet</h3>
                <p className="text-text-secondary">Add input fields to get started building your calculator</p>
              </div>
            )}
          </div>

          {/* Input Settings */}
          {selectedInput ? (
            <div className="card">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Field Settings: {selectedInput.label}
              </h3>
              
              {/* Settings Tabs */}
              <div className="mb-4 border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveSettingsTab('validation')}
                    className={`px-3 py-2 text-sm font-medium ${
                      activeSettingsTab === 'validation'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    Validation
                  </button>
                  <button
                    onClick={() => setActiveSettingsTab('conditional')}
                    className={`px-3 py-2 text-sm font-medium ${
                      activeSettingsTab === 'conditional'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    Conditional Logic
                  </button>
                </div>
              </div>
              
              {/* Validation Rules */}
              {activeSettingsTab === 'validation' && (
                <ValidationRulesEditor
                  input={selectedInput}
                  onUpdate={updateInput}
                />
              )}
              
              {/* Conditional Logic */}
              {activeSettingsTab === 'conditional' && (
                <>
                  {hasAccess('customization') ? (
                    <ConditionalLogicEditor
                      input={selectedInput}
                      allInputs={data.inputSchema}
                      onUpdate={updateInput}
                    />
                  ) : (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-text-primary mb-1">Pro Feature</h4>
                          <p className="text-sm text-text-secondary mb-3">
                            Conditional logic requires a Pro or Business subscription.
                          </p>
                          <a href="/pricing" className="text-primary hover:text-primary/80 text-sm font-medium">
                            Upgrade to unlock
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="card bg-gray-50 border border-gray-200 text-center py-8">
              <Settings className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-text-primary mb-2">No Field Selected</h3>
              <p className="text-text-secondary text-sm">
                Select an input field to configure its settings
              </p>
            </div>
          )}
        </div>
      )}

      {/* Output Display Tab */}
      {activeTab === 'outputs' && (
        <OutputDesigner data={data} onChange={onChange} />
      )}

      {/* Styling Tab */}
      {activeTab === 'style' && (
        <>
          {hasAccess('customization') ? (
            <StyleEditor data={data} onChange={onChange} />
          ) : (
            <div className="card">
              <div className="text-center py-8">
                <Sliders className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-text-primary mb-3">Advanced Styling</h3>
                <p className="text-text-secondary max-w-md mx-auto mb-6">
                  Customize colors, fonts, spacing, and more with our advanced styling options.
                  Available on Pro and Business plans.
                </p>
                <a href="/pricing" className="btn-primary inline-flex items-center">
                  Upgrade to Unlock Styling
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default InputDesigner
