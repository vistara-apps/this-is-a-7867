import React, { useState, useEffect } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Download, RefreshCw, Users, Eye, MousePointer, CheckCircle, AlertTriangle } from 'lucide-react'
import { getAnalytics, getTimeSeriesData, getLeads, exportLeadsToCSV, EVENT_TYPES } from '../lib/analytics'
import { useSubscription } from '../hooks/useSubscription'

function AnalyticsDashboard({ calculator }) {
  const [timeframe, setTimeframe] = useState('week')
  const [eventType, setEventType] = useState(EVENT_TYPES.VIEW)
  const [analyticsData, setAnalyticsData] = useState(null)
  const [timeSeriesData, setTimeSeriesData] = useState([])
  const [leads, setLeads] = useState([])
  const [leadCount, setLeadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { hasAccess } = useSubscription()

  // Fetch analytics data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Get analytics summary
        const { data, error: analyticsError } = await getAnalytics(calculator.calculatorId, timeframe)
        
        if (analyticsError) throw new Error(analyticsError)
        
        setAnalyticsData(data)
        
        // Get time series data
        const { data: seriesData, error: seriesError } = await getTimeSeriesData(
          calculator.calculatorId, 
          eventType, 
          timeframe, 
          timeframe === 'day' ? 'hour' : 'day'
        )
        
        if (seriesError) throw new Error(seriesError)
        
        setTimeSeriesData(seriesData || [])
        
        // Get leads if user has access
        if (hasAccess('leadCapture')) {
          const { data: leadsData, count, error: leadsError } = await getLeads(calculator.calculatorId, 10, 0)
          
          if (leadsError) throw new Error(leadsError)
          
          setLeads(leadsData || [])
          setLeadCount(count || 0)
        }
      } catch (err) {
        console.error('Error fetching analytics:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    if (calculator?.calculatorId) {
      fetchData()
    }
  }, [calculator, timeframe, eventType, hasAccess])

  const handleExportLeads = async () => {
    try {
      setLoading(true)
      
      const { csvString, error: exportError } = await exportLeadsToCSV(calculator.calculatorId)
      
      if (exportError) throw new Error(exportError)
      
      // Create download link
      const blob = new Blob([csvString], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.setAttribute('hidden', '')
      a.setAttribute('href', url)
      a.setAttribute('download', `${calculator.name}-leads.csv`)
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (err) {
      console.error('Error exporting leads:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  if (!calculator) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">Select a calculator to view analytics</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text-primary">
          Analytics: {calculator.name}
        </h2>
        
        <div className="flex items-center space-x-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="input-field py-1 px-3 text-sm"
          >
            <option value="day">Last 24 Hours</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
            <option value="all">All Time</option>
          </select>
          
          <button
            onClick={() => {
              setLoading(true)
              getAnalytics(calculator.calculatorId, timeframe).then(({ data }) => {
                setAnalyticsData(data)
                setLoading(false)
              })
            }}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {loading && !analyticsData ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-text-secondary">Loading analytics data...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-text-secondary text-sm">Views</h3>
                <Eye className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-text-primary">
                {analyticsData?.views.toLocaleString() || 0}
              </p>
              <p className="text-xs text-text-secondary mt-1">
                Total calculator views
              </p>
            </div>
            
            <div className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-text-secondary text-sm">Interactions</h3>
                <MousePointer className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-text-primary">
                {analyticsData?.interactions.toLocaleString() || 0}
              </p>
              <p className="text-xs text-text-secondary mt-1">
                {analyticsData?.interactionRate.toFixed(1) || 0}% interaction rate
              </p>
            </div>
            
            <div className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-text-secondary text-sm">Completions</h3>
                <CheckCircle className="h-5 w-5 text-accent" />
              </div>
              <p className="text-3xl font-bold text-text-primary">
                {analyticsData?.completions.toLocaleString() || 0}
              </p>
              <p className="text-xs text-text-secondary mt-1">
                {analyticsData?.completionRate.toFixed(1) || 0}% completion rate
              </p>
            </div>
            
            <div className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-text-secondary text-sm">Leads</h3>
                <Users className="h-5 w-5 text-purple-500" />
              </div>
              <p className="text-3xl font-bold text-text-primary">
                {analyticsData?.leads.toLocaleString() || 0}
              </p>
              <p className="text-xs text-text-secondary mt-1">
                {analyticsData?.leadConversionRate.toFixed(1) || 0}% conversion rate
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-text-primary">Performance Over Time</h3>
              
              <div>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="input-field py-1 px-3 text-sm"
                >
                  <option value={EVENT_TYPES.VIEW}>Views</option>
                  <option value={EVENT_TYPES.INTERACTION}>Interactions</option>
                  <option value={EVENT_TYPES.COMPLETION}>Completions</option>
                  <option value={EVENT_TYPES.LEAD_CAPTURE}>Leads</option>
                </select>
              </div>
            </div>
            
            <div className="h-80">
              {timeSeriesData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  {timeframe === 'day' ? (
                    <BarChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  ) : (
                    <LineChart data={timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-text-secondary">No data available for the selected timeframe</p>
                </div>
              )}
            </div>
          </div>

          {/* Leads Table */}
          {hasAccess('leadCapture') ? (
            <div className="card p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-text-primary">
                  Recent Leads ({leadCount})
                </h3>
                
                <button
                  onClick={handleExportLeads}
                  disabled={loading || leads.length === 0}
                  className="btn-secondary flex items-center space-x-2 text-sm"
                >
                  <Download className="h-4 w-4" />
                  <span>Export CSV</span>
                </button>
              </div>
              
              {leads.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-2 text-left text-sm font-medium text-text-secondary">Date</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-text-secondary">Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-text-secondary">Email</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-text-secondary">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead) => (
                        <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-text-secondary">
                            {formatDate(lead.timestamp)}
                          </td>
                          <td className="px-4 py-3 text-sm text-text-primary">
                            {lead.metadata?.name || '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-text-primary">
                            {lead.metadata?.email || '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-text-primary">
                            {lead.metadata?.result || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-text-secondary">No leads captured yet</p>
                </div>
              )}
            </div>
          ) : (
            <div className="card p-6 bg-gray-50">
              <div className="text-center">
                <Users className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-text-primary mb-2">Lead Capture Analytics</h3>
                <p className="text-text-secondary max-w-md mx-auto mb-4">
                  Upgrade to Pro or Business plan to access lead capture analytics and export leads to CSV.
                </p>
                <a href="/pricing" className="btn-primary inline-flex items-center">
                  Upgrade Plan
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AnalyticsDashboard

