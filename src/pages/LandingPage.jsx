import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Calculator, Zap, Code, BarChart3, ArrowRight, CheckCircle } from 'lucide-react'

function LandingPage() {
  const navigate = useNavigate()

  const features = [
    {
      icon: Calculator,
      title: 'Custom Formula Builder',
      description: 'Create complex calculations with our visual, no-code interface. Support for variables, conditionals, and lookups.'
    },
    {
      icon: Zap,
      title: 'Intuitive Design',
      description: 'Build beautiful calculator interfaces with pre-made templates and customizable input/output components.'
    },
    {
      icon: Code,
      title: 'One-Click Embedding',
      description: 'Get simple JavaScript snippets or iframe codes to embed calculators anywhere on your website.'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Leads',
      description: 'Track performance metrics and capture leads with built-in CRM and email service integrations.'
    }
  ]

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      features: [
        'Up to 3 calculators',
        'Basic templates',
        'Standard embedding',
        'Community support'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Pro',
      price: '$25',
      period: '/month',
      features: [
        'Unlimited calculators',
        'Custom formulas',
        'Advanced analytics',
        'Lead capture',
        'Priority support'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Business',
      price: '$75',
      period: '/month',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'API access',
        'White-label options',
        'Dedicated support'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-bg">
      {/* Header */}
      <header className="bg-surface/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container-fluid mx-auto">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Calculator className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-text-primary">FormulaFlow</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-text-secondary hover:text-text-primary transition-colors">Features</a>
              <a href="#pricing" className="text-text-secondary hover:text-text-primary transition-colors">Pricing</a>
              <a href="#contact" className="text-text-secondary hover:text-text-primary transition-colors">Contact</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/app')}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => navigate('/app')}
                className="btn-primary"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container-fluid mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-extrabold text-text-primary mb-6">
              Build Custom Calculators
              <span className="text-primary"> Without Code</span>
            </h1>
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              Empower your business with interactive calculators that engage users and capture leads. 
              Create, customize, and embed in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => navigate('/app')}
                className="btn-primary text-lg px-8 py-4 flex items-center space-x-2"
              >
                <span>Start Building Free</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="btn-secondary text-lg px-8 py-4">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-surface">
        <div className="container-fluid mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Everything You Need to Build Calculators
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              From simple calculations to complex formulas, FormulaFlow provides all the tools 
              you need to create engaging calculator experiences.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container-fluid mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-text-secondary">
              Choose the plan that fits your needs. Upgrade or downgrade anytime.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`card relative ${plan.popular ? 'ring-2 ring-primary scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-text-primary mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-text-primary">{plan.price}</span>
                    <span className="text-text-secondary ml-1">{plan.period}</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                      <span className="text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={() => navigate('/app')}
                  className={`w-full py-3 rounded-md font-medium transition-colors ${
                    plan.popular 
                      ? 'bg-primary text-white hover:bg-primary/90' 
                      : 'bg-gray-100 text-text-primary hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container-fluid mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Build Your First Calculator?
          </h2>
          <p className="text-xl text-primary-200 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using FormulaFlow to engage users and capture leads.
          </p>
          <button 
            onClick={() => navigate('/app')}
            className="bg-white text-primary px-8 py-4 rounded-md font-medium text-lg hover:bg-gray-100 transition-colors flex items-center space-x-2 mx-auto"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface border-t border-gray-200 py-12">
        <div className="container-fluid mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Calculator className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-text-primary">FormulaFlow</span>
            </div>
            
            <div className="flex items-center space-x-6 text-text-secondary">
              <a href="#" className="hover:text-text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-text-primary transition-colors">Support</a>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-text-secondary">
            <p>&copy; 2024 FormulaFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage