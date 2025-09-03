import React from 'react'
import { useSubscription } from '../hooks/useSubscription'
import { Crown, Zap } from 'lucide-react'

function SubscriptionBadge({ showIcon = true, showLabel = true }) {
  const { currentPlan } = useSubscription()

  // Determine badge style based on plan
  const getBadgeStyle = () => {
    switch (currentPlan.id) {
      case 'pro':
        return {
          bg: 'bg-primary/10',
          text: 'text-primary',
          icon: <Zap className="h-4 w-4" />
        }
      case 'business':
        return {
          bg: 'bg-accent/10',
          text: 'text-accent',
          icon: <Crown className="h-4 w-4" />
        }
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-text-secondary',
          icon: null
        }
    }
  }

  const style = getBadgeStyle()

  // Don't show badge for free plan unless explicitly requested
  if (currentPlan.id === 'free' && !showLabel) {
    return null
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      {showIcon && style.icon && <span className="mr-1">{style.icon}</span>}
      {showLabel && currentPlan.name}
    </span>
  )
}

export default SubscriptionBadge

