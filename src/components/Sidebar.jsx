import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Calculator, 
  BarChart3, 
  Settings, 
  Plus 
} from 'lucide-react'

function Sidebar() {
  const location = useLocation()
  
  const navItems = [
    { to: '/app', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { to: '/app/builder', icon: Calculator, label: 'Calculator Builder' },
    { to: '/app/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/app/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <aside className="w-64 bg-surface border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Calculator className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-text-primary">FormulaFlow</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          <NavLink
            to="/app/builder"
            className="w-full flex items-center justify-center space-x-2 bg-primary text-white px-4 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Calculator</span>
          </NavLink>
          
          <div className="pt-4 space-y-1">
            {navItems.map((item) => {
              const isActive = item.exact 
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to)
              
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary border-r-2 border-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              )
            })}
          </div>
        </div>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
          <p className="text-sm font-medium text-accent">Pro Plan</p>
          <p className="text-xs text-text-secondary">Unlimited calculators</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar