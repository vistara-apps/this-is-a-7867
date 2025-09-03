import React, { useState } from 'react'
import { Copy, Check, Code, ExternalLink } from 'lucide-react'

function EmbedCodeGenerator({ calculator }) {
  const [copied, setCopied] = useState(false)
  const [embedType, setEmbedType] = useState('iframe')

  // Generate embed code based on type
  const generateEmbedCode = () => {
    const baseUrl = `${window.location.origin}/embed/${calculator.calculatorId}`
    
    switch (embedType) {
      case 'iframe':
        return `<iframe
  src="${baseUrl}"
  width="100%"
  height="600"
  frameborder="0"
  allowtransparency="true"
  style="border: 1px solid #e2e8f0; border-radius: 8px;"
></iframe>`
      
      case 'javascript':
        return `<div id="formula-flow-calculator-${calculator.calculatorId}"></div>
<script src="${window.location.origin}/embed.js" 
  data-calculator-id="${calculator.calculatorId}"
  data-container-id="formula-flow-calculator-${calculator.calculatorId}">
</script>`
      
      case 'wordpress':
        return `[formula_flow id="${calculator.calculatorId}"]`
      
      default:
        return `<iframe src="${baseUrl}" width="100%" height="600" frameborder="0"></iframe>`
    }
  }

  const embedCode = generateEmbedCode()

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Embed Calculator
      </h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-text-primary mb-2">
          Embed Type
        </label>
        <div className="flex space-x-2">
          <button
            onClick={() => setEmbedType('iframe')}
            className={`px-3 py-1.5 text-sm rounded-md ${
              embedType === 'iframe'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
            }`}
          >
            iFrame
          </button>
          <button
            onClick={() => setEmbedType('javascript')}
            className={`px-3 py-1.5 text-sm rounded-md ${
              embedType === 'javascript'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
            }`}
          >
            JavaScript
          </button>
          <button
            onClick={() => setEmbedType('wordpress')}
            className={`px-3 py-1.5 text-sm rounded-md ${
              embedType === 'wordpress'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
            }`}
          >
            WordPress
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-text-primary mb-2">
          Embed Code
        </label>
        <div className="relative">
          <pre className="bg-gray-50 p-4 rounded-md border border-gray-200 text-sm font-mono overflow-x-auto">
            {embedCode}
          </pre>
          <button
            onClick={copyToClipboard}
            className="absolute top-2 right-2 p-2 bg-white rounded-md border border-gray-200 text-text-secondary hover:text-text-primary transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <a
          href={`/embed/${calculator.calculatorId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:text-primary/80 text-sm font-medium flex items-center"
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          Preview Embed
        </a>
        
        <div className="flex items-center">
          <Code className="h-4 w-4 text-text-secondary mr-2" />
          <span className="text-sm text-text-secondary">
            {embedType === 'wordpress' ? 'Shortcode' : 'HTML Code'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default EmbedCodeGenerator

