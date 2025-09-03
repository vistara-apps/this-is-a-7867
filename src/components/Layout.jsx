import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Calculator, 
  BarChart2, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown 
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useSubscription } from '../hooks/useSubscription'
import SubscriptionBadge from './SubscriptionBadge'

function Layout() {
  const { user, signOut } = useAuth()
  const { currentPlan } = useSubscription()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-30 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } lg:static lg:z-0`}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary">FormulaFlow</h1>
            <button 
              className="lg:hidden text-text-secondary hover:text-text-primary"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <nav className="p-4 space-y-1">
          <NavLink
            to="/app"
            end
            className={({ isActive }) => 
              `flex items-center px-3 py-2 rounded-md ${
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-text-secondary hover:bg-gray-100'
              }`
            }
          >
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Dashboard
          </NavLink>
          
          <NavLink
            to="/app/builder"
            className={({ isActive }) => 
              `flex items-center px-3 py-2 rounded-md ${
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-text-secondary hover:bg-gray-100'
              }`
            }
          >
            <Calculator className="h-5 w-5 mr-3" />
            Calculator Builder
          </NavLink>
          
          <NavLink
            to="/app/analytics"
            className={({ isActive }) => 
              `flex items-center px-3 py-2 rounded-md ${
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-text-secondary hover:bg-gray-100'
              }`
            }
          >
            <BarChart2 className="h-5 w-5 mr-3" />
            Analytics
          </NavLink>
          
          <NavLink
            to="/app/settings"
            className={({ isActive }) => 
              `flex items-center px-3 py-2 rounded-md ${
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-text-secondary hover:bg-gray-100'
              }`
            }
          >
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </NavLink>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <SubscriptionBadge />
            
            <button
              onClick={handleSignOut}
              className="p-2 text-text-secondary hover:text-text-primary rounded-full hover:bg-gray-100"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <button
              className="lg:hidden p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="relative ml-auto">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden md:block text-text-primary">
                  {user?.email || 'User'}
                </span>
                <ChevronDown className="h-4 w-4 text-text-secondary" />
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {user?.email}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {currentPlan.name} Plan
                    </p>
                  </div>
                  
                  <NavLink
                    to="/app/settings"
                    className="block px-4 py-2 text-sm text-text-secondary hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Account Settings
                  </NavLink>
                  
                  <NavLink
                    to="/pricing"
                    className="block px-4 py-2 text-sm text-text-secondary hover:bg-gray-100"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Upgrade Plan
                  </NavLink>
                  
                  <button
                    onClick={() => {
                      setUserMenuOpen(false)
                      handleSignOut()
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-text-secondary hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout

