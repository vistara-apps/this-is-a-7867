import React from 'react'
import { useApp } from '../contexts/AppContext'
import { User, Bell, Settings } from 'lucide-react'

function Header() {
  const { user } = useApp()

  return (
    <header className="bg-surface border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">FormulaFlow</h1>
          <p className="text-sm text-text-secondary">Build custom calculators without code</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-text-secondary hover:text-text-primary transition-colors">
            <Bell className="h-5 w-5" />
          </button>
          <button className="p-2 text-text-secondary hover:text-text-primary transition-colors">
            <Settings className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-text-primary">{user.email}</p>
              <p className="text-xs text-text-secondary capitalize">{user.subscriptionTier} Plan</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header