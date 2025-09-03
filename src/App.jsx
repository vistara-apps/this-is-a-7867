import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import CalculatorBuilder from './pages/CalculatorBuilder'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Pricing from './pages/Pricing'
import Checkout from './pages/Checkout'
import SignIn from './pages/Auth/SignIn'
import SignUp from './pages/Auth/SignUp'
import ResetPassword from './pages/Auth/ResetPassword'
import EmbedPage from './pages/EmbedPage'
import PreviewCalculator from './pages/PreviewCalculator'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/auth/sign-in" element={<SignIn />} />
            <Route path="/auth/sign-up" element={<SignUp />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/auth/reset-password/:token" element={<ResetPassword />} />
            
            {/* Embed route (no layout) */}
            <Route path="/embed/:calculatorId" element={<EmbedPage />} />
            
            {/* Preview route (public but with layout) */}
            <Route path="/preview/:calculatorId" element={<PreviewCalculator />} />
            
            {/* Checkout route (requires auth but not in app layout) */}
            <Route path="/checkout" element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            } />
            
            {/* Protected routes with app layout */}
            <Route path="/app" element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="builder/:id?" element={<CalculatorBuilder />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  )
}

export default App

