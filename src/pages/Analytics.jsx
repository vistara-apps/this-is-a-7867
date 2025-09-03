import React from 'react'
import { useApp } from '../contexts/AppContext'
import { BarChart3, TrendingUp, Users, Eye, Calculator } from 'lucide-react'

function Analytics() {
  const { calculators, usageEvents } = useApp()

  // Calculate analytics data
  const totalViews = calculators.reduce((sum, calc) => sum + calc.analyticsData.views, 0)
  const totalCompletions = calculators.reduce((sum, calc) => sum + calc.analyticsData.completions, 0)
  const totalConversions = calculators.reduce((sum, calc) => sum + calc.analyticsData.conversions, 0)
  const conversionRate = totalViews > 0 ? ((totalConversions / totalViews) * 100).toFixed(1) : '0'

  // Get top performing calculators
  const topCalculators = [...calculators]
    .sort((a, b) => b.analyticsData.views - a.analyticsData.views)
    .slice(0, 5)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Analytics</h1>
        <p className="text-text-secondary mt-1">Track performance and engagement across all your calculators</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm font-medium">Total Views</p>
              <p className="text-3xl font-bold text-text-primary">{totalViews.toLocaleString()}</p>
              <p className="text-accent text-sm">+12% this month</p>
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
              <p className="text-3xl font-bold text-text-primary">{totalCompletions.toLocaleString()}</p>
              <p className="text-accent text-sm">+8% this month</p>
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
              <p className="text-3xl font-bold text-text-primary">{totalConversions.toLocaleString()}</p>
              <p className="text-accent text-sm">+15% this month</p>
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
              <p className="text-3xl font-bold text-text-primary">{conversionRate}%</p>
              <p className="text-accent text-sm">+2.3% this month</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Performance Overview</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-text-secondary mx-auto mb-4" />
              <p className="text-text-secondary">Chart visualization would be rendered here</p>
              <p className="text-sm text-text-secondary">Shows views, completions, and conversions over time</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold text-text-primary mb-4">Top Performing Calculators</h2>
          {topCalculators.length === 0 ? (
            <div className="text-center py-8">
              <Calculator className="h-8 w-8 text-text-secondary mx-auto mb-2" />
              <p className="text-text-secondary">No calculator data yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topCalculators.map((calculator, index) => (
                <div key={calculator.calculatorId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{calculator.name}</p>
                      <p className="text-sm text-text-secondary">
                        {calculator.analyticsData.views} views • {calculator.analyticsData.completions} completions
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-text-primary">
                      {((calculator.analyticsData.conversions / calculator.analyticsData.views) * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-text-secondary">conversion</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detailed Analytics Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Calculator Performance</h2>
          <div className="flex items-center space-x-2">
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option>Last 30 days</option>
              <option>Last 7 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
        </div>

        {calculators.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">No analytics data yet</h3>
            <p className="text-text-secondary">Create and publish calculators to start tracking analytics</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Calculator</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Views</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Completions</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Conversions</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Conversion Rate</th>
                  <th className="text-left py-3 px-4 font-medium text-text-secondary">Status</th>
                </tr>
              </thead>
              <tbody>
                {calculators.map((calculator) => {
                  const convRate = calculator.analyticsData.views > 0 
                    ? ((calculator.analyticsData.conversions / calculator.analyticsData.views) * 100).toFixed(1)
                    : '0'
                  
                  return (
                    <tr key={calculator.calculatorId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Calculator className="h-4 w-4 text-primary" />
                          </div>
                          <span className="font-medium text-text-primary">{calculator.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-text-primary">{calculator.analyticsData.views.toLocaleString()}</td>
                      <td className="py-4 px-4 text-text-primary">{calculator.analyticsData.completions.toLocaleString()}</td>
                      <td className="py-4 px-4 text-text-primary">{calculator.analyticsData.conversions.toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          parseFloat(convRate) >= 5
                            ? 'bg-accent/10 text-accent'
                            : parseFloat(convRate) >= 2
                            ? 'bg-orange-100 text-orange-600'
                            : 'bg-gray-100 text-text-secondary'
                        }`}>
                          {convRate}%
                        </span>
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
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Analytics