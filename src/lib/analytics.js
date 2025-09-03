import { supabase } from './supabase'
import { v4 as uuidv4 } from 'uuid'

// Event types
export const EVENT_TYPES = {
  VIEW: 'view',
  INTERACTION: 'interaction',
  COMPLETION: 'completion',
  LEAD_CAPTURE: 'lead_capture',
  ERROR: 'error'
}

/**
 * Track a calculator usage event
 * @param {string} calculatorId - ID of the calculator
 * @param {string} eventType - Type of event (view, interaction, completion, lead_capture, error)
 * @param {Object} metadata - Additional data about the event
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
export const trackEvent = async (calculatorId, eventType, metadata = {}) => {
  try {
    if (!calculatorId) {
      throw new Error('Calculator ID is required')
    }
    
    if (!Object.values(EVENT_TYPES).includes(eventType)) {
      throw new Error(`Invalid event type: ${eventType}`)
    }
    
    const eventData = {
      id: uuidv4(),
      calculator_id: calculatorId,
      event_type: eventType,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      ip_address: '127.0.0.1', // This will be set by the server
      metadata: metadata
    }
    
    // Track event in Supabase
    const { error } = await supabase
      .from('usage_events')
      .insert([eventData])
    
    if (error) throw error
    
    return { success: true, error: null }
  } catch (err) {
    console.error('Error tracking event:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Get analytics data for a calculator
 * @param {string} calculatorId - ID of the calculator
 * @param {string} timeframe - Timeframe for analytics (day, week, month, year, all)
 * @returns {Promise<{data: Object, error: string|null}>}
 */
export const getAnalytics = async (calculatorId, timeframe = 'all') => {
  try {
    if (!calculatorId) {
      throw new Error('Calculator ID is required')
    }
    
    // Get date range based on timeframe
    let startDate = null
    const now = new Date()
    
    switch (timeframe) {
      case 'day':
        startDate = new Date(now.setDate(now.getDate() - 1))
        break
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7))
        break
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1))
        break
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1))
        break
      case 'all':
      default:
        startDate = null
        break
    }
    
    // Build query
    let query = supabase
      .from('usage_events')
      .select('event_type, count(*)')
      .eq('calculator_id', calculatorId)
      .group('event_type')
    
    // Add date filter if needed
    if (startDate) {
      query = query.gte('timestamp', startDate.toISOString())
    }
    
    // Execute query
    const { data, error } = await query
    
    if (error) throw error
    
    // Format data
    const formattedData = {
      views: 0,
      interactions: 0,
      completions: 0,
      leads: 0,
      errors: 0
    }
    
    data.forEach(item => {
      switch (item.event_type) {
        case EVENT_TYPES.VIEW:
          formattedData.views = parseInt(item.count)
          break
        case EVENT_TYPES.INTERACTION:
          formattedData.interactions = parseInt(item.count)
          break
        case EVENT_TYPES.COMPLETION:
          formattedData.completions = parseInt(item.count)
          break
        case EVENT_TYPES.LEAD_CAPTURE:
          formattedData.leads = parseInt(item.count)
          break
        case EVENT_TYPES.ERROR:
          formattedData.errors = parseInt(item.count)
          break
      }
    })
    
    // Calculate conversion rates
    formattedData.interactionRate = formattedData.views > 0 
      ? (formattedData.interactions / formattedData.views) * 100 
      : 0
    
    formattedData.completionRate = formattedData.views > 0 
      ? (formattedData.completions / formattedData.views) * 100 
      : 0
    
    formattedData.leadConversionRate = formattedData.completions > 0 
      ? (formattedData.leads / formattedData.completions) * 100 
      : 0
    
    return { data: formattedData, error: null }
  } catch (err) {
    console.error('Error getting analytics:', err)
    return { data: null, error: err.message }
  }
}

/**
 * Get time series data for a calculator
 * @param {string} calculatorId - ID of the calculator
 * @param {string} eventType - Type of event to get data for
 * @param {string} timeframe - Timeframe for analytics (day, week, month, year)
 * @param {string} interval - Interval for data points (hour, day, week, month)
 * @returns {Promise<{data: Array, error: string|null}>}
 */
export const getTimeSeriesData = async (calculatorId, eventType, timeframe = 'week', interval = 'day') => {
  try {
    if (!calculatorId) {
      throw new Error('Calculator ID is required')
    }
    
    if (!Object.values(EVENT_TYPES).includes(eventType)) {
      throw new Error(`Invalid event type: ${eventType}`)
    }
    
    // Get date range based on timeframe
    let startDate = null
    const now = new Date()
    
    switch (timeframe) {
      case 'day':
        startDate = new Date(now.setDate(now.getDate() - 1))
        break
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7))
        break
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1))
        break
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1))
        break
      default:
        startDate = new Date(now.setDate(now.getDate() - 7)) // Default to week
        break
    }
    
    // Build query
    let query = supabase
      .from('usage_events')
      .select('timestamp')
      .eq('calculator_id', calculatorId)
      .eq('event_type', eventType)
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: true })
    
    // Execute query
    const { data, error } = await query
    
    if (error) throw error
    
    // Group data by interval
    const groupedData = {}
    
    data.forEach(item => {
      const date = new Date(item.timestamp)
      let key = ''
      
      switch (interval) {
        case 'hour':
          key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:00`
          break
        case 'day':
          key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
          break
        case 'week':
          // Get the first day of the week (Sunday)
          const firstDay = new Date(date)
          const day = date.getDay()
          firstDay.setDate(date.getDate() - day)
          key = `${firstDay.getFullYear()}-${firstDay.getMonth() + 1}-${firstDay.getDate()}`
          break
        case 'month':
          key = `${date.getFullYear()}-${date.getMonth() + 1}`
          break
        default:
          key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
          break
      }
      
      if (!groupedData[key]) {
        groupedData[key] = 0
      }
      
      groupedData[key]++
    })
    
    // Convert to array format for charts
    const timeSeriesData = Object.keys(groupedData).map(key => ({
      date: key,
      count: groupedData[key]
    }))
    
    return { data: timeSeriesData, error: null }
  } catch (err) {
    console.error('Error getting time series data:', err)
    return { data: null, error: err.message }
  }
}

/**
 * Get lead data for a calculator
 * @param {string} calculatorId - ID of the calculator
 * @param {number} limit - Maximum number of leads to return
 * @param {number} offset - Offset for pagination
 * @returns {Promise<{data: Array, count: number, error: string|null}>}
 */
export const getLeads = async (calculatorId, limit = 10, offset = 0) => {
  try {
    if (!calculatorId) {
      throw new Error('Calculator ID is required')
    }
    
    // Get count of leads
    const { count, error: countError } = await supabase
      .from('usage_events')
      .select('id', { count: 'exact' })
      .eq('calculator_id', calculatorId)
      .eq('event_type', EVENT_TYPES.LEAD_CAPTURE)
    
    if (countError) throw countError
    
    // Get lead data
    const { data, error } = await supabase
      .from('usage_events')
      .select('id, timestamp, metadata')
      .eq('calculator_id', calculatorId)
      .eq('event_type', EVENT_TYPES.LEAD_CAPTURE)
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) throw error
    
    return { data, count, error: null }
  } catch (err) {
    console.error('Error getting leads:', err)
    return { data: null, count: 0, error: err.message }
  }
}

/**
 * Export leads to CSV
 * @param {string} calculatorId - ID of the calculator
 * @returns {Promise<{csvString: string, error: string|null}>}
 */
export const exportLeadsToCSV = async (calculatorId) => {
  try {
    if (!calculatorId) {
      throw new Error('Calculator ID is required')
    }
    
    // Get all leads
    const { data, error } = await supabase
      .from('usage_events')
      .select('timestamp, metadata')
      .eq('calculator_id', calculatorId)
      .eq('event_type', EVENT_TYPES.LEAD_CAPTURE)
      .order('timestamp', { ascending: false })
    
    if (error) throw error
    
    if (!data || data.length === 0) {
      return { csvString: 'No leads found', error: null }
    }
    
    // Get all possible headers from metadata
    const headers = new Set(['Timestamp'])
    data.forEach(lead => {
      if (lead.metadata) {
        Object.keys(lead.metadata).forEach(key => headers.add(key))
      }
    })
    
    // Convert to array
    const headerArray = Array.from(headers)
    
    // Create CSV string
    let csvString = headerArray.join(',') + '\n'
    
    data.forEach(lead => {
      const row = []
      
      headerArray.forEach(header => {
        if (header === 'Timestamp') {
          row.push(new Date(lead.timestamp).toLocaleString())
        } else {
          const value = lead.metadata && lead.metadata[header] ? lead.metadata[header] : ''
          // Escape commas and quotes
          const escapedValue = typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
          row.push(escapedValue)
        }
      })
      
      csvString += row.join(',') + '\n'
    })
    
    return { csvString, error: null }
  } catch (err) {
    console.error('Error exporting leads to CSV:', err)
    return { csvString: null, error: err.message }
  }
}

