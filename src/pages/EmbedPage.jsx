import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import CalculatorPreview from '../components/CalculatorPreview'
import { Loader2 } from 'lucide-react'

function EmbedPage() {
  const { calculatorId } = useParams()
  const [calculator, setCalculator] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch calculator data
  useEffect(() => {
    const fetchCalculator = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const { data, error } = await supabase
          .from('calculators')
          .select('*')
          .eq('calculatorId', calculatorId)
          .single()
        
        if (error) throw error
        
        setCalculator(data)
      } catch (err) {
        console.error('Error fetching calculator:', err)
        setError('Calculator not found or unavailable')
      } finally {
        setLoading(false)
      }
    }
    
    if (calculatorId) {
      fetchCalculator()
    }
  }, [calculatorId])

  // Add message listener for parent window communication
  useEffect(() => {
    const handleMessage = (event) => {
      // Verify origin for security
      const allowedOrigins = [
        window.location.origin,
        'https://example.com' // Add your allowed domains here
      ]
      
      if (!allowedOrigins.includes(event.origin)) {
        return
      }
      
      // Handle messages from parent window
      if (event.data && event.data.type === 'resize') {
        // Adjust iframe height if needed
      }
    }
    
    window.addEventListener('message', handleMessage)
    
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  if (error || !calculator) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          {error || 'Calculator not found'}
        </h2>
        <p className="text-text-secondary">
          The calculator you're looking for might have been removed or is unavailable.
        </p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <CalculatorPreview data={calculator} showLeadCapture={true} />
    </div>
  )
}

export default EmbedPage

