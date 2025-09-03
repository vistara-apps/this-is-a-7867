import React from 'react'
import { useSubscription } from '../hooks/useSubscription'
import { Check, X, Loader2 } from 'lucide-react'

function PricingTable({ onSubscribe }) {
  const { 
    currentPlan, 
    plans, 
    loading 
  } = useSubscription()

  // Feature comparison data
  const features = [
    { name: 'Number of calculators', key: 'calculators' },
    { name: 'Monthly embeds', key: 'embeds' },
    { name: 'Input fields per calculator', key: 'inputs' },
    { name: 'Custom styling', key: 'customization' },
    { name: 'AI formula assistant', key: 'aiAssistant' },
    { name: 'Analytics', key: 'analytics' },
    { name: 'Lead capture', key: 'leadCapture' },
    { name: 'Team members', key: 'teamMembers' },
    { name: 'API access', key: 'api' },
    { name: 'White labeling', key: 'whiteLabel' }
  ]

  // Format limit value for display
  const formatLimit = (limit, key) => {
    if (limit === Infinity) {
      return 'Unlimited'
    }
    
    if (limit === true) {
      return <Check className="h-5 w-5 text-accent mx-auto" />
    }
    
    if (limit === false) {
      return <X className="h-5 w-5 text-gray-300 mx-auto" />
    }
    
    if (key === 'analytics') {
      return limit.charAt(0).toUpperCase() + limit.slice(1)
    }
    
    return limit
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left py-4 px-6 bg-gray-50 text-text-primary font-medium">Features</th>
            {Object.values(plans).map((plan) => (
              <th key={plan.id} className="py-4 px-6 bg-gray-50 text-text-primary font-medium">
                {plan.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Price row */}
          <tr className="border-t border-gray-200">
            <td className="py-4 px-6 text-text-secondary">Monthly price</td>
            {Object.values(plans).map((plan) => (
              <td key={plan.id} className="py-4 px-6 text-center">
                <span className="font-medium text-text-primary">${plan.price}</span>
                <span className="text-text-secondary">/mo</span>
              </td>
            ))}
          </tr>
          
          {/* Feature rows */}
          {features.map((feature) => (
            <tr key={feature.key} className="border-t border-gray-200">
              <td className="py-4 px-6 text-text-secondary">{feature.name}</td>
              {Object.values(plans).map((plan) => (
                <td key={plan.id} className="py-4 px-6 text-center">
                  {plan.limits[feature.key] !== undefined ? (
                    <span className="text-text-primary">
                      {formatLimit(plan.limits[feature.key], feature.key)}
                    </span>
                  ) : (
                    <X className="h-5 w-5 text-gray-300 mx-auto" />
                  )}
                </td>
              ))}
            </tr>
          ))}
          
          {/* Action row */}
          <tr className="border-t border-gray-200">
            <td className="py-4 px-6"></td>
            {Object.values(plans).map((plan) => (
              <td key={plan.id} className="py-4 px-6 text-center">
                <button
                  onClick={() => onSubscribe(plan.id)}
                  disabled={currentPlan.id === plan.id || loading}
                  className={`py-2 px-4 rounded-md text-sm font-medium ${
                    currentPlan.id === plan.id
                      ? 'bg-gray-100 text-text-primary cursor-default'
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                  ) : currentPlan.id === plan.id ? (
                    'Current Plan'
                  ) : plan.id === 'free' ? (
                    'Downgrade'
                  ) : (
                    `Upgrade to ${plan.name}`
                  )}
                </button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default PricingTable

