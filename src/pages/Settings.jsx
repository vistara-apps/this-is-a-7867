import React, { useState } from 'react'
import { useApp } from '../contexts/AppContext'
import { User, CreditCard, Bell, Key, Trash2, Save } from 'lucide-react'

function Settings() {
  const { user } = useApp()
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: user.email,
    company: 'My Company',
    website: 'https://mycompany.com'
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'api', label: 'API Keys', icon: Key },
  ]

  const handleSaveProfile = () => {
    // In a real app, this would save to the backend
    alert('Profile updated successfully!')
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Company</label>
                  <input
                    type="text"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Website</label>
                  <input
                    type="url"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
              <div className="mt-6">
                <button onClick={handleSaveProfile} className="btn-primary flex items-center space-x-2">
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Account Actions</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-text-primary">Change Password</h4>
                    <p className="text-sm text-text-secondary">Update your account password</p>
                  </div>
                  <button className="btn-secondary">Change Password</button>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                  <div>
                    <h4 className="font-medium text-red-700">Delete Account</h4>
                    <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                  </div>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors flex items-center space-x-2">
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'billing':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">Current Plan</h3>
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-semibold text-text-primary">Pro Plan</h4>
                    <p className="text-text-secondary">Unlimited calculators, advanced analytics</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-text-primary">$25<span className="text-sm font-normal">/month</span></p>
                    <p className="text-sm text-text-secondary">Next billing: Jan 15, 2024</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-center space-x-3">
                  <button className="btn-secondary">Change Plan</button>
                  <button className="btn-secondary">Cancel Subscription</button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">Payment Method</h3>
              <div className="card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">VISA</span>
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">**** **** **** 4242</p>
                      <p className="text-sm text-text-secondary">Expires 12/25</p>
                    </div>
                  </div>
                  <button className="btn-secondary">Update</button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">Billing History</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-text-secondary">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-text-primary">Dec 15, 2023</td>
                      <td className="py-3 px-4 text-text-primary">Pro Plan - Monthly</td>
                      <td className="py-3 px-4 text-text-primary">$25.00</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                          Paid
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-text-primary">Nov 15, 2023</td>
                      <td className="py-3 px-4 text-text-primary">Pro Plan - Monthly</td>
                      <td className="py-3 px-4 text-text-primary">$25.00</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                          Paid
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">Email Notifications</h3>
              <div className="space-y-4">
                {[
                  { title: 'Calculator Analytics', description: 'Weekly reports on calculator performance' },
                  { title: 'New Features', description: 'Updates about new FormulaFlow features' },
                  { title: 'Billing Updates', description: 'Payment confirmations and billing reminders' },
                  { title: 'Security Alerts', description: 'Login attempts and security notifications' },
                ].map((notification, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-text-primary">{notification.title}</h4>
                      <p className="text-sm text-text-secondary">{notification.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'api':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">API Keys</h3>
              <p className="text-text-secondary mb-6">Use API keys to integrate FormulaFlow with your applications.</p>
              
              <div className="space-y-4">
                <div className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-text-primary">Production API Key</h4>
                      <p className="text-sm text-text-secondary font-mono">ff_prod_•••••••••••••••••••••••••••••••••••••••••••</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="btn-secondary">Regenerate</button>
                      <button className="btn-secondary">Copy</button>
                    </div>
                  </div>
                </div>
                
                <div className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-text-primary">Test API Key</h4>
                      <p className="text-sm text-text-secondary font-mono">ff_test_•••••••••••••••••••••••••••••••••••••••••••</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="btn-secondary">Regenerate</button>
                      <button className="btn-secondary">Copy</button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button className="btn-primary">Generate New Key</button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">API Documentation</h3>
              <div className="card">
                <p className="text-text-secondary mb-4">Access your calculators programmatically with our REST API.</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">GET /api/calculators</code>
                    <span className="text-sm text-text-secondary">List all calculators</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">POST /api/calculators</code>
                    <span className="text-sm text-text-secondary">Create calculator</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">GET /api/analytics</code>
                    <span className="text-sm text-text-secondary">Get analytics data</span>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="btn-secondary">View Full Documentation</button>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary mt-1">Manage your account, billing, and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary border-r-2 border-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings