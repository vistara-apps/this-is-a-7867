import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import FormulaBuilder from '../components/FormulaBuilder'
import InputDesigner from '../components/InputDesigner'
import CalculatorPreview from '../components/CalculatorPreview'
import { Save, Eye, Settings, Code } from 'lucide-react'

function CalculatorBuilder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { calculators, currentCalculator, setCurrentCalculator, addCalculator, updateCalculator } = useApp()
  
  const [activeTab, setActiveTab] = useState('inputs')
  const [calculatorData, setCalculatorData] = useState({
    name: '',
    inputSchema: [],
    outputSchema: [],
    formulaLogic: '',
    isPublished: false
  })

  // Load calculator data
  useEffect(() => {
    if (id) {
      const calculator = calculators.find(c => c.calculatorId === id)
      if (calculator) {
        setCurrentCalculator(calculator)
        setCalculatorData(calculator)
      }
    } else {
      // New calculator
      setCalculatorData({
        name: '',
        inputSchema: [],
        outputSchema: [],
        formulaLogic: '',
        isPublished: false
      })
    }
  }, [id, calculators, setCurrentCalculator])

  const handleSave = () => {
    if (!calculatorData.name.trim()) {
      alert('Please enter a calculator name')
      return
    }

    const dataToSave = {
      ...calculatorData,
      embedCode: `<iframe src="https://formulaflow.com/embed/${id || 'new'}" width="400" height="300"></iframe>`
    }

    if (id) {
      updateCalculator({ ...dataToSave, calculatorId: id })
    } else {
      addCalculator(dataToSave)
    }
    
    navigate('/app')
  }

  const handlePublish = () => {
    const updatedData = { ...calculatorData, isPublished: !calculatorData.isPublished }
    setCalculatorData(updatedData)
    
    if (id) {
      updateCalculator({ ...updatedData, calculatorId: id })
    }
  }

  const tabs = [
    { id: 'inputs', label: 'Input Design', icon: Settings },
    { id: 'formula', label: 'Formula Builder', icon: Code },
    { id: 'preview', label: 'Preview', icon: Eye }
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-surface border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={calculatorData.name}
              onChange={(e) => setCalculatorData({ ...calculatorData, name: e.target.value })}
              placeholder="Enter calculator name..."
              className="text-xl font-semibold bg-transparent border-none outline-none text-text-primary placeholder-text-secondary"
            />
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              calculatorData.isPublished 
                ? 'bg-accent/10 text-accent' 
                : 'bg-gray-100 text-text-secondary'
            }`}>
              {calculatorData.isPublished ? 'Published' : 'Draft'}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePublish}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                calculatorData.isPublished
                  ? 'bg-gray-100 text-text-primary hover:bg-gray-200'
                  : 'bg-accent text-white hover:bg-accent/90'
              }`}
            >
              {calculatorData.isPublished ? 'Unpublish' : 'Publish'}
            </button>
            <button
              onClick={handleSave}
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-surface border-b border-gray-200 px-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'inputs' && (
          <InputDesigner
            data={calculatorData}
            onChange={setCalculatorData}
          />
        )}
        
        {activeTab === 'formula' && (
          <FormulaBuilder
            data={calculatorData}
            onChange={setCalculatorData}
          />
        )}
        
        {activeTab === 'preview' && (
          <CalculatorPreview
            data={calculatorData}
          />
        )}
      </div>
    </div>
  )
}

export default CalculatorBuilder