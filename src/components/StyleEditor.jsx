import React, { useState } from 'react'
import { Palette, Layout, Type, ArrowRight } from 'lucide-react'

function StyleEditor({ data, onChange }) {
  const [activeTab, setActiveTab] = useState('colors')
  
  const updateStyle = (category, property, value) => {
    const updatedStyle = {
      ...data.style,
      [category]: {
        ...(data.style?.[category] || {}),
        [property]: value
      }
    }
    
    onChange({
      ...data,
      style: updatedStyle
    })
  }
  
  // Default style values
  const style = {
    colors: {
      primary: data.style?.colors?.primary || '#3b82f6',
      secondary: data.style?.colors?.secondary || '#6b7280',
      background: data.style?.colors?.background || '#ffffff',
      text: data.style?.colors?.text || '#1e293b',
      border: data.style?.colors?.border || '#e2e8f0'
    },
    layout: {
      padding: data.style?.layout?.padding || 'medium',
      borderRadius: data.style?.layout?.borderRadius || 'medium',
      width: data.style?.layout?.width || 'responsive',
      alignment: data.style?.layout?.alignment || 'left'
    },
    typography: {
      fontFamily: data.style?.typography?.fontFamily || 'system',
      fontSize: data.style?.typography?.fontSize || 'medium',
      headingStyle: data.style?.typography?.headingStyle || 'bold',
      inputStyle: data.style?.typography?.inputStyle || 'outline'
    }
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-text-primary mb-6">Calculator Styling</h3>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('colors')}
          className={`px-4 py-2 font-medium text-sm flex items-center ${
            activeTab === 'colors'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Palette className="h-4 w-4 mr-2" />
          Colors
        </button>
        <button
          onClick={() => setActiveTab('layout')}
          className={`px-4 py-2 font-medium text-sm flex items-center ${
            activeTab === 'layout'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Layout className="h-4 w-4 mr-2" />
          Layout
        </button>
        <button
          onClick={() => setActiveTab('typography')}
          className={`px-4 py-2 font-medium text-sm flex items-center ${
            activeTab === 'typography'
              ? 'text-primary border-b-2 border-primary'
              : 'text-text-secondary hover:text-text-primary'
          }`}
        >
          <Type className="h-4 w-4 mr-2" />
          Typography
        </button>
      </div>
      
      {/* Colors Tab */}
      {activeTab === 'colors' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Primary Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={style.colors.primary}
                onChange={(e) => updateStyle('colors', 'primary', e.target.value)}
                className="h-8 w-8 rounded cursor-pointer"
              />
              <input
                type="text"
                value={style.colors.primary}
                onChange={(e) => updateStyle('colors', 'primary', e.target.value)}
                className="input-field"
              />
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Used for buttons, links, and highlights
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Secondary Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={style.colors.secondary}
                onChange={(e) => updateStyle('colors', 'secondary', e.target.value)}
                className="h-8 w-8 rounded cursor-pointer"
              />
              <input
                type="text"
                value={style.colors.secondary}
                onChange={(e) => updateStyle('colors', 'secondary', e.target.value)}
                className="input-field"
              />
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Used for secondary elements and accents
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Background Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={style.colors.background}
                onChange={(e) => updateStyle('colors', 'background', e.target.value)}
                className="h-8 w-8 rounded cursor-pointer"
              />
              <input
                type="text"
                value={style.colors.background}
                onChange={(e) => updateStyle('colors', 'background', e.target.value)}
                className="input-field"
              />
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Main calculator background
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Text Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={style.colors.text}
                onChange={(e) => updateStyle('colors', 'text', e.target.value)}
                className="h-8 w-8 rounded cursor-pointer"
              />
              <input
                type="text"
                value={style.colors.text}
                onChange={(e) => updateStyle('colors', 'text', e.target.value)}
                className="input-field"
              />
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Main text color
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Border Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={style.colors.border}
                onChange={(e) => updateStyle('colors', 'border', e.target.value)}
                className="h-8 w-8 rounded cursor-pointer"
              />
              <input
                type="text"
                value={style.colors.border}
                onChange={(e) => updateStyle('colors', 'border', e.target.value)}
                className="input-field"
              />
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Color for borders and dividers
            </p>
          </div>
        </div>
      )}
      
      {/* Layout Tab */}
      {activeTab === 'layout' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Padding
            </label>
            <select
              value={style.layout.padding}
              onChange={(e) => updateStyle('layout', 'padding', e.target.value)}
              className="input-field"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
            <p className="text-xs text-text-secondary mt-1">
              Spacing around calculator elements
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Border Radius
            </label>
            <select
              value={style.layout.borderRadius}
              onChange={(e) => updateStyle('layout', 'borderRadius', e.target.value)}
              className="input-field"
            >
              <option value="none">None (Square corners)</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="full">Full (Rounded corners)</option>
            </select>
            <p className="text-xs text-text-secondary mt-1">
              Roundness of corners
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Width
            </label>
            <select
              value={style.layout.width}
              onChange={(e) => updateStyle('layout', 'width', e.target.value)}
              className="input-field"
            >
              <option value="narrow">Narrow</option>
              <option value="medium">Medium</option>
              <option value="wide">Wide</option>
              <option value="responsive">Responsive (Adapts to container)</option>
            </select>
            <p className="text-xs text-text-secondary mt-1">
              Width of the calculator when embedded
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Alignment
            </label>
            <select
              value={style.layout.alignment}
              onChange={(e) => updateStyle('layout', 'alignment', e.target.value)}
              className="input-field"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
            <p className="text-xs text-text-secondary mt-1">
              Text and element alignment
            </p>
          </div>
        </div>
      )}
      
      {/* Typography Tab */}
      {activeTab === 'typography' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Font Family
            </label>
            <select
              value={style.typography.fontFamily}
              onChange={(e) => updateStyle('typography', 'fontFamily', e.target.value)}
              className="input-field"
            >
              <option value="system">System Default</option>
              <option value="sans">Sans-serif</option>
              <option value="serif">Serif</option>
              <option value="mono">Monospace</option>
            </select>
            <p className="text-xs text-text-secondary mt-1">
              Main font for all text
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Font Size
            </label>
            <select
              value={style.typography.fontSize}
              onChange={(e) => updateStyle('typography', 'fontSize', e.target.value)}
              className="input-field"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
            <p className="text-xs text-text-secondary mt-1">
              Base size for all text
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Heading Style
            </label>
            <select
              value={style.typography.headingStyle}
              onChange={(e) => updateStyle('typography', 'headingStyle', e.target.value)}
              className="input-field"
            >
              <option value="light">Light</option>
              <option value="regular">Regular</option>
              <option value="bold">Bold</option>
              <option value="extra-bold">Extra Bold</option>
            </select>
            <p className="text-xs text-text-secondary mt-1">
              Style for calculator title and labels
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Input Style
            </label>
            <select
              value={style.typography.inputStyle}
              onChange={(e) => updateStyle('typography', 'inputStyle', e.target.value)}
              className="input-field"
            >
              <option value="outline">Outline</option>
              <option value="filled">Filled</option>
              <option value="underline">Underline</option>
              <option value="minimal">Minimal</option>
            </select>
            <p className="text-xs text-text-secondary mt-1">
              Visual style for input fields
            </p>
          </div>
        </div>
      )}
      
      {/* Preview */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="font-medium text-text-primary mb-4">Style Preview</h4>
        
        <div 
          className="p-4 border rounded-md"
          style={{
            backgroundColor: style.colors.background,
            borderColor: style.colors.border,
            borderRadius: 
              style.layout.borderRadius === 'none' ? '0' :
              style.layout.borderRadius === 'small' ? '0.25rem' :
              style.layout.borderRadius === 'medium' ? '0.5rem' :
              style.layout.borderRadius === 'large' ? '0.75rem' :
              style.layout.borderRadius === 'full' ? '1rem' : '0.5rem',
            padding:
              style.layout.padding === 'small' ? '0.75rem' :
              style.layout.padding === 'medium' ? '1.25rem' :
              style.layout.padding === 'large' ? '2rem' : '1.25rem',
            textAlign: style.layout.alignment,
            fontFamily:
              style.typography.fontFamily === 'sans' ? 'ui-sans-serif, system-ui, sans-serif' :
              style.typography.fontFamily === 'serif' ? 'ui-serif, Georgia, serif' :
              style.typography.fontFamily === 'mono' ? 'ui-monospace, monospace' : 'inherit',
            fontSize:
              style.typography.fontSize === 'small' ? '0.875rem' :
              style.typography.fontSize === 'medium' ? '1rem' :
              style.typography.fontSize === 'large' ? '1.125rem' : '1rem'
          }}
        >
          <div 
            className="mb-4"
            style={{
              color: style.colors.text,
              fontWeight:
                style.typography.headingStyle === 'light' ? '300' :
                style.typography.headingStyle === 'regular' ? '400' :
                style.typography.headingStyle === 'bold' ? '700' :
                style.typography.headingStyle === 'extra-bold' ? '800' : '700'
            }}
          >
            <div className="text-lg mb-1">Calculator Title</div>
            <div className="text-sm opacity-75">Enter values to calculate results</div>
          </div>
          
          <div className="mb-4">
            <label 
              className="block mb-1 text-sm"
              style={{ color: style.colors.text }}
            >
              Input Label
            </label>
            <input
              type="text"
              placeholder="Sample input"
              className="w-full px-3 py-2 rounded-md"
              style={{
                borderWidth: '1px',
                borderStyle: 
                  style.typography.inputStyle === 'underline' ? 'none' : 'solid',
                borderColor: style.colors.border,
                borderBottomWidth: 
                  style.typography.inputStyle === 'underline' ? '1px' : undefined,
                borderBottomStyle: 
                  style.typography.inputStyle === 'underline' ? 'solid' : undefined,
                borderBottomColor: 
                  style.typography.inputStyle === 'underline' ? style.colors.primary : undefined,
                backgroundColor: 
                  style.typography.inputStyle === 'filled' ? '#f9fafb' : 
                  style.typography.inputStyle === 'minimal' ? 'transparent' : 'white',
                color: style.colors.text
              }}
            />
          </div>
          
          <button
            className="px-4 py-2 rounded-md"
            style={{
              backgroundColor: style.colors.primary,
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Calculate
          </button>
          
          <div 
            className="mt-4 p-3 rounded-md"
            style={{
              backgroundColor: `${style.colors.primary}10`,
              borderLeft: `4px solid ${style.colors.primary}`,
              color: style.colors.text
            }}
          >
            <div className="flex justify-between items-center">
              <span className="text-sm">Result:</span>
              <span className="text-lg font-bold" style={{ color: style.colors.primary }}>
                1,234.56
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StyleEditor

