import React, { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, ChevronDown, ChevronRight } from 'lucide-react'

function SortableInputItem({ input, onUpdate, onRemove }) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: input.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const addOption = () => {
    const newOptions = [...(input.options || []), `Option ${(input.options?.length || 0) + 1}`]
    onUpdate(input.id, { options: newOptions })
  }

  const updateOption = (index, value) => {
    const newOptions = [...(input.options || [])]
    newOptions[index] = value
    onUpdate(input.id, { options: newOptions })
  }

  const removeOption = (index) => {
    const newOptions = (input.options || []).filter((_, i) => i !== index)
    onUpdate(input.id, { options: newOptions })
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-surface border border-gray-200 rounded-lg"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
          >
            <GripVertical className="h-4 w-4 text-text-secondary" />
          </div>
          
          <div className="flex-1">
            <input
              type="text"
              value={input.label}
              onChange={(e) => onUpdate(input.id, { label: e.target.value })}
              className="font-medium text-text-primary bg-transparent border-none outline-none w-full"
            />
            <p className="text-sm text-text-secondary capitalize">{input.type} input</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
          <button
            onClick={() => onRemove(input.id)}
            className="p-2 text-text-secondary hover:text-red-600 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-200">
          <div className="pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Placeholder</label>
                <input
                  type="text"
                  value={input.placeholder || ''}
                  onChange={(e) => onUpdate(input.id, { placeholder: e.target.value })}
                  placeholder="Enter placeholder text..."
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Default Value</label>
                <input
                  type={input.type === 'number' ? 'number' : 'text'}
                  value={input.defaultValue || ''}
                  onChange={(e) => onUpdate(input.id, { defaultValue: e.target.value })}
                  placeholder="Default value..."
                  className="input-field"
                />
              </div>
            </div>

            {/* Number-specific options */}
            {input.type === 'number' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Min Value</label>
                  <input
                    type="number"
                    value={input.min || ''}
                    onChange={(e) => onUpdate(input.id, { min: e.target.value })}
                    placeholder="Minimum"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Max Value</label>
                  <input
                    type="number"
                    value={input.max || ''}
                    onChange={(e) => onUpdate(input.id, { max: e.target.value })}
                    placeholder="Maximum"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Step</label>
                  <input
                    type="number"
                    value={input.step || ''}
                    onChange={(e) => onUpdate(input.id, { step: e.target.value })}
                    placeholder="1"
                    className="input-field"
                  />
                </div>
              </div>
            )}

            {/* Range-specific options */}
            {input.type === 'range' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Min Value</label>
                  <input
                    type="number"
                    value={input.min || 0}
                    onChange={(e) => onUpdate(input.id, { min: parseInt(e.target.value) })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Max Value</label>
                  <input
                    type="number"
                    value={input.max || 100}
                    onChange={(e) => onUpdate(input.id, { max: parseInt(e.target.value) })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Step</label>
                  <input
                    type="number"
                    value={input.step || 1}
                    onChange={(e) => onUpdate(input.id, { step: parseInt(e.target.value) })}
                    className="input-field"
                  />
                </div>
              </div>
            )}

            {/* Select-specific options */}
            {input.type === 'select' && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Options</label>
                <div className="space-y-2">
                  {(input.options || []).map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        className="input-field"
                        placeholder={`Option ${index + 1}`}
                      />
                      <button
                        onClick={() => removeOption(index)}
                        className="p-2 text-text-secondary hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addOption}
                    className="btn-secondary text-sm"
                  >
                    Add Option
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                id={`required-${input.id}`}
                checked={input.required || false}
                onChange={(e) => onUpdate(input.id, { required: e.target.checked })}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor={`required-${input.id}`} className="ml-2 text-sm text-text-primary">
                Required field
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SortableInputItem