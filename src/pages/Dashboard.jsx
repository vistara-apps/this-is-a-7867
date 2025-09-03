import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { Plus, Eye, Users, TrendingUp, Calculator, Edit, Trash2, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

function Dashboard() {
  const navigate = useNavigate()
  const { calculators, deleteCalculator, addUsageEvent } = useApp()

  const totalViews = calculators.reduce((sum, calc) => sum + calc.analyticsData.views, 0)
  const totalCompletions = calculators.reduce((sum, calc) => sum + calc.analyticsData.completions, 0)
  const totalConversions = calculators.reduce((sum, calc) => sum + calc.analyticsData.conversions, 0)

  const conversionRate = totalViews > 0 ? ((totalConversions / totalViews) * 100).toFixed(1) : '0'

  const handleEditCalculator = (calculator) => {
    navigate(`/app/builder/${calculator.calculatorId}`)
  }

  const handleDeleteCalculator = (id) => {
    if (window.confirm('Are you sure you want to delete this calculator?')) {
      deleteCalculator(id)
    }
  }

  const handleViewCalculator = (calculator) => {
    addUsageEvent({
      calculatorId: calculator.calculatorId,
      eventType: 'view'
    })
    // In a real app, this would open the calculator in a new window
    alert('Calculator preview would open here!')
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary mt-1">Manage your calculators and track performance</p>
        </div>
        <button
          onClick={() => navigate('/app/builder')}
          className="btn-primary mt-4 sm:mt-0 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Calculator</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium">Total Views</p>
              <p className="text-2xl font-bold text-text-primary">{totalViews.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Eye className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium">Completions</p>
              <p className="text-2xl font-bold text-text-primary">{totalCompletions.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-accent" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium">Conversions</p>
              <p className="text-2xl font-bold text-text-primary">{totalConversions.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium">Conversion Rate</p>
              <p className="text-2xl font-bold text-text-primary">{conversionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calculator className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Calculators */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Your Calculators</h2>
          <button
            onClick={() => navigate('/app/builder')}
            className="btn-secondary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create New</span>
          </button>
        </div>

        {calculators.length === 0 ? (
          <div className="text-center py-12">
            <Calculator className="h-12 w-12 text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">No calculators yet</h3>
            <p className="text-text-secondary mb-6">Get started by creating your first calculator</p>
            <button
              onClick={() => navigate('/app/builder')}
              className="btn-primary"
            >
              Create Your First Calculator
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Views</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Completions</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Created</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {calculators.map((calculator) => (
                  <tr key={calculator.calculatorId} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Calculator className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">{calculator.name}</p>
                          <p className="text-sm text-text-secondary">{calculator.inputSchema.length} inputs</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        calculator.isPublished 
                          ? 'bg-accent/10 text-accent' 
                          : 'bg-gray-100 text-text-secondary'
                      }`}>
                        {calculator.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-text-primary">{calculator.analyticsData.views.toLocaleString()}</td>
                    <td className="py-4 px-4 text-text-primary">{calculator.analyticsData.completions.toLocaleString()}</td>
                    <td className="py-4 px-4 text-text-secondary">
                      {formatDistanceToNow(new Date(calculator.createdAt), { addSuffix: true })}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewCalculator(calculator)}
                          className="p-2 text-text-secondary hover:text-primary transition-colors"
                          title="Preview"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditCalculator(calculator)}
                          className="p-2 text-text-secondary hover:text-primary transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCalculator(calculator.calculatorId)}
                          className="p-2 text-text-secondary hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard