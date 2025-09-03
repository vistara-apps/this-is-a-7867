import React, { useState } from 'react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus, X, GripHorizontal } from 'lucide-react'

// Sortable formula item component
function SortableFormulaItem({ item, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id })
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center px-3 py-2 rounded-md ${
        item.type === 'variable' 
          ? 'bg-primary/10 text-primary' 
          : item.type === 'operator' 
            ? 'bg-gray-100 text-text-primary' 
            : 'bg-accent/10 text-accent'
      }`}
    >
      <div {...attributes} {...listeners} className="cursor-grab mr-2">
        <GripHorizontal className="h-4 w-4 opacity-50" />
      </div>
      <span className="font-mono">{item.value}</span>
      <button
        onClick={() => onRemove(item.id)}
        className="ml-2 text-gray-400 hover:text-gray-600"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  )
}

function VisualFormulaBuilder({ data, onChange }) {
  const [formulaItems, setFormulaItems] = useState(() => {
    // Parse existing formula into items if available
    if (data.formulaLogic) {
      try {
        // This is a simplified parser for demonstration
        // A real implementation would need a more robust parser
        const tokens = data.formulaLogic.match(/([a-zA-Z_][a-zA-Z0-9_]*|\d+(\.\d+)?|[+\-*/()><=%!&|?:]|>=|<=|==|!=|&&|\|\|)/g) || []
        
        return tokens.map((token, index) => {
          const isVariable = data.inputSchema.some(input => input.id === token)
          const isOperator = ['+', '-', '*', '/', '(', ')', '>', '<', '=', '!', '&', '|', '?', ':', '>=', '<=', '==', '!=', '&&', '||'].includes(token)
          
          return {
            id: `item-${index}`,
            value: token,
            type: isVariable ? 'variable' : isOperator ? 'operator' : 'function'
          }
        })
      } catch (err) {
        console.error('Error parsing formula:', err)
        return []
      }
    }
    
    return []
  })
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    
    if (active.id !== over.id) {
      setFormulaItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over.id)
        
        const newItems = arrayMove(items, oldIndex, newIndex)
        updateFormula(newItems)
        return newItems
      })
    }
  }

  const addItem = (value, type) => {
    const newItem = {
      id: `item-${Date.now()}`,
      value,
      type
    }
    
    const newItems = [...formulaItems, newItem]
    setFormulaItems(newItems)
    updateFormula(newItems)
  }

  const removeItem = (id) => {
    const newItems = formulaItems.filter(item => item.id !== id)
    setFormulaItems(newItems)
    updateFormula(newItems)
  }

  const updateFormula = (items) => {
    const formula = items.map(item => item.value).join(' ')
    onChange({ ...data, formulaLogic: formula })
  }

  const clearFormula = () => {
    setFormulaItems([])
    onChange({ ...data, formulaLogic: '' })
  }

  // Common operators and functions
  const operators = [
    { value: '+', label: 'Add' },
    { value: '-', label: 'Subtract' },
    { value: '*', label: 'Multiply' },
    { value: '/', label: 'Divide' },
    { value: '(', label: 'Open Bracket' },
    { value: ')', label: 'Close Bracket' },
    { value: '>', label: 'Greater Than' },
    { value: '<', label: 'Less Than' },
    { value: '>=', label: 'Greater/Equal' },
    { value: '<=', label: 'Less/Equal' },
    { value: '==', label: 'Equal' },
    { value: '!=', label: 'Not Equal' },
    { value: '&&', label: 'AND' },
    { value: '||', label: 'OR' },
    { value: '?', label: 'If' },
    { value: ':', label: 'Else' }
  ]
  
  const functions = [
    { value: 'Math.round()', label: 'Round' },
    { value: 'Math.floor()', label: 'Floor' },
    { value: 'Math.ceil()', label: 'Ceiling' },
    { value: 'Math.abs()', label: 'Absolute' },
    { value: 'Math.max()', label: 'Maximum' },
    { value: 'Math.min()', label: 'Minimum' },
    { value: 'Math.pow()', label: 'Power' },
    { value: 'Math.sqrt()', label: 'Square Root' }
  ]

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Visual Formula Builder</h3>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-text-primary">
              Formula Elements
            </label>
            {formulaItems.length > 0 && (
              <button
                onClick={clearFormula}
                className="text-sm text-red-600 hover:text-red-800"
              >
                Clear All
              </button>
            )}
          </div>
          
          <div className="min-h-16 p-4 bg-gray-50 border border-gray-200 rounded-md">
            {formulaItems.length > 0 ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToHorizontalAxis]}
              >
                <SortableContext
                  items={formulaItems.map(item => item.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  <div className="flex flex-wrap gap-2">
                    {formulaItems.map((item) => (
                      <SortableFormulaItem
                        key={item.id}
                        item={item}
                        onRemove={removeItem}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              <div className="text-center py-4 text-text-secondary">
                Add variables, operators, and functions to build your formula
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Variables */}
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-2">Variables</h4>
            <div className="flex flex-wrap gap-2">
              {data.inputSchema.map((input) => (
                <button
                  key={input.id}
                  onClick={() => addItem(input.id, 'variable')}
                  className="flex items-center px-3 py-1.5 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  <span className="font-mono text-sm">{input.id}</span>
                </button>
              ))}
              
              {data.inputSchema.length === 0 && (
                <div className="text-sm text-text-secondary">
                  No input variables defined yet. Add some in the Input Designer.
                </div>
              )}
            </div>
          </div>
          
          {/* Operators */}
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-2">Operators</h4>
            <div className="flex flex-wrap gap-2">
              {operators.map((op) => (
                <button
                  key={op.value}
                  onClick={() => addItem(op.value, 'operator')}
                  className="flex items-center px-3 py-1.5 bg-gray-100 text-text-primary rounded-md hover:bg-gray-200 transition-colors"
                  title={op.label}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  <span className="font-mono text-sm">{op.value}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Functions */}
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-2">Functions</h4>
            <div className="flex flex-wrap gap-2">
              {functions.map((func) => (
                <button
                  key={func.value}
                  onClick={() => addItem(func.value, 'function')}
                  className="flex items-center px-3 py-1.5 bg-accent/10 text-accent rounded-md hover:bg-accent/20 transition-colors"
                  title={func.label}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  <span className="font-mono text-sm">{func.value}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Formula Preview</h3>
        <pre className="p-4 bg-gray-50 border border-gray-200 rounded-md font-mono text-sm overflow-x-auto">
          {data.formulaLogic || 'No formula defined yet'}
        </pre>
      </div>
    </div>
  )
}

export default VisualFormulaBuilder

