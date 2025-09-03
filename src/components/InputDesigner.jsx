import React, { useState } from 'react'
import { Plus, Trash2, GripVertical, Type, Hash, List, ToggleLeft } from 'lucide-react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import SortableInputItem from './SortableInputItem'
import { v4 as uuidv4 } from 'uuid'

function InputDesigner({ data, onChange }) {
  const [showAddInput, setShowAddInput] = useState(false)
  
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
    { id: 'range', label: 'Slider', icon: ToggleLeft, description: 'Range slider input' }
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
      ...(type === 'number' && { min: '', max: '', step: '' })
    }

    onChange({
      ...data,
      inputSchema: [...data.inputSchema, newInput]
    })
    setShowAddInput(false)
  }

  const updateInput = (inputId, updates) => {
    const updatedInputs = data.inputSchema.map(input =>
      input.id === inputId ? { ...input, ...updates } : input
    )
    onChange({ ...data, inputSchema: updatedInputs })
  }

  const removeInput = (inputId) => {
    const updatedInputs = data.inputSchema.filter(input => input.id !== inputId)
    onChange({ ...data, inputSchema: updatedInputs })
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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Input Design</h2>
        <p className="text-text-secondary">Design the input fields for your calculator. Drag to reorder.</p>
      </div>

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

      {/* Input Fields List */}
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
                  <SortableInputItem
                    key={input.id}
                    input={input}
                    onUpdate={updateInput}
                    onRemove={removeInput}
                  />
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

      {/* Output Configuration */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Output Configuration</h3>
        <div className="card">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Result Label</label>
              <input
                type="text"
                value={data.outputSchema[0]?.label || ''}
                onChange={(e) => {
                  const outputSchema = [{
                    id: 'result',
                    label: e.target.value,
                    type: 'number'
                  }]
                  onChange({ ...data, outputSchema })
                }}
                placeholder="e.g., Monthly Payment, ROI Percentage, Total Cost"
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Result Format</label>
              <select
                value={data.outputSchema[0]?.type || 'number'}
                onChange={(e) => {
                  const outputSchema = [{
                    id: 'result',
                    label: data.outputSchema[0]?.label || 'Result',
                    type: e.target.value
                  }]
                  onChange({ ...data, outputSchema })
                }}
                className="input-field"
              >
                <option value="number">Number</option>
                <option value="currency">Currency</option>
                <option value="percentage">Percentage</option>
                <option value="text">Text</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InputDesigner