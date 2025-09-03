import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

const AppContext = createContext()

const initialState = {
  user: {
    userId: 'user-1',
    email: 'demo@formulaflow.com',
    subscriptionTier: 'pro',
    createdAt: new Date().toISOString()
  },
  calculators: [],
  currentCalculator: null,
  usageEvents: [],
  isAuthenticated: true
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_CALCULATORS':
      return { ...state, calculators: action.payload }
    
    case 'ADD_CALCULATOR':
      const newCalculator = {
        calculatorId: uuidv4(),
        userId: state.user.userId,
        name: action.payload.name || 'Untitled Calculator',
        formulaLogic: action.payload.formulaLogic || '',
        inputSchema: action.payload.inputSchema || [],
        outputSchema: action.payload.outputSchema || [],
        embedCode: '',
        analyticsData: { views: 0, completions: 0, conversions: 0 },
        isPublished: false,
        createdAt: new Date().toISOString()
      }
      const updatedCalculators = [...state.calculators, newCalculator]
      return { ...state, calculators: updatedCalculators, currentCalculator: newCalculator }
    
    case 'UPDATE_CALCULATOR':
      const updatedCalcs = state.calculators.map(calc => 
        calc.calculatorId === action.payload.calculatorId 
          ? { ...calc, ...action.payload }
          : calc
      )
      const updatedCurrent = action.payload.calculatorId === state.currentCalculator?.calculatorId
        ? { ...state.currentCalculator, ...action.payload }
        : state.currentCalculator
      return { ...state, calculators: updatedCalcs, currentCalculator: updatedCurrent }
    
    case 'SET_CURRENT_CALCULATOR':
      return { ...state, currentCalculator: action.payload }
    
    case 'DELETE_CALCULATOR':
      return {
        ...state,
        calculators: state.calculators.filter(calc => calc.calculatorId !== action.payload),
        currentCalculator: state.currentCalculator?.calculatorId === action.payload ? null : state.currentCalculator
      }
    
    case 'ADD_USAGE_EVENT':
      const newEvent = {
        eventId: uuidv4(),
        calculatorId: action.payload.calculatorId,
        eventType: action.payload.eventType,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        ipAddress: '127.0.0.1'
      }
      return { ...state, usageEvents: [...state.usageEvents, newEvent] }
    
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Load demo data
  useEffect(() => {
    const demoCalculators = [
      {
        calculatorId: 'calc-1',
        userId: 'user-1',
        name: 'ROI Calculator',
        formulaLogic: '((output - input) / input) * 100',
        inputSchema: [
          { id: 'input', label: 'Initial Investment', type: 'number', required: true },
          { id: 'output', label: 'Final Value', type: 'number', required: true }
        ],
        outputSchema: [
          { id: 'roi', label: 'Return on Investment (%)', type: 'number' }
        ],
        embedCode: '<iframe src="https://formulaflow.com/embed/calc-1" width="400" height="300"></iframe>',
        analyticsData: { views: 1250, completions: 423, conversions: 67 },
        isPublished: true,
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
      },
      {
        calculatorId: 'calc-2',
        userId: 'user-1',
        name: 'Mortgage Payment Calculator',
        formulaLogic: '(principal * (rate * Math.pow(1 + rate, term))) / (Math.pow(1 + rate, term) - 1)',
        inputSchema: [
          { id: 'principal', label: 'Loan Amount', type: 'number', required: true },
          { id: 'rate', label: 'Interest Rate (%)', type: 'number', required: true },
          { id: 'term', label: 'Loan Term (years)', type: 'number', required: true }
        ],
        outputSchema: [
          { id: 'payment', label: 'Monthly Payment', type: 'currency' }
        ],
        embedCode: '<iframe src="https://formulaflow.com/embed/calc-2" width="400" height="350"></iframe>',
        analyticsData: { views: 890, completions: 234, conversions: 45 },
        isPublished: true,
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
      }
    ]
    dispatch({ type: 'SET_CALCULATORS', payload: demoCalculators })
  }, [])

  const value = {
    ...state,
    dispatch,
    
    // Helper functions
    addCalculator: (calculator) => dispatch({ type: 'ADD_CALCULATOR', payload: calculator }),
    updateCalculator: (calculator) => dispatch({ type: 'UPDATE_CALCULATOR', payload: calculator }),
    deleteCalculator: (id) => dispatch({ type: 'DELETE_CALCULATOR', payload: id }),
    setCurrentCalculator: (calculator) => dispatch({ type: 'SET_CURRENT_CALCULATOR', payload: calculator }),
    addUsageEvent: (event) => dispatch({ type: 'ADD_USAGE_EVENT', payload: event }),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}