import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should be proxied through a backend
})

/**
 * Generate a formula based on a natural language description
 * @param {string} description - Natural language description of the formula
 * @param {Array} inputFields - Array of input field objects with id and label
 * @returns {Promise<{formula: string, explanation: string}>}
 */
export const generateFormula = async (description, inputFields) => {
  try {
    const inputVariables = inputFields.map(field => `${field.label} (variable name: ${field.id})`).join(', ')
    
    const prompt = `
      You are a formula generation assistant for a calculator builder application.
      
      Generate a JavaScript formula based on the following description:
      "${description}"
      
      Available input variables:
      ${inputVariables}
      
      Return a JSON object with the following structure:
      {
        "formula": "The JavaScript formula using the input variable names",
        "explanation": "A brief explanation of how the formula works"
      }
      
      The formula should be valid JavaScript that can be evaluated with Function() constructor.
      Use only the input variable names provided above.
      Do not include any UI elements or console.log statements.
    `
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a formula generation assistant that outputs valid JavaScript formulas.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 500,
      response_format: { type: 'json_object' }
    })
    
    const result = JSON.parse(response.choices[0].message.content)
    return result
  } catch (error) {
    console.error('Error generating formula:', error)
    throw new Error('Failed to generate formula. Please try again.')
  }
}

/**
 * Explain a formula in natural language
 * @param {string} formula - The JavaScript formula to explain
 * @param {Array} inputFields - Array of input field objects with id and label
 * @returns {Promise<string>} - Natural language explanation
 */
export const explainFormula = async (formula, inputFields) => {
  try {
    const inputVariables = inputFields.map(field => `${field.id}: ${field.label}`).join(', ')
    
    const prompt = `
      Explain the following JavaScript formula in simple terms:
      "${formula}"
      
      Input variables:
      ${inputVariables}
      
      Provide a clear, concise explanation that a non-technical person could understand.
    `
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that explains formulas in simple terms.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 300
    })
    
    return response.choices[0].message.content.trim()
  } catch (error) {
    console.error('Error explaining formula:', error)
    throw new Error('Failed to explain formula. Please try again.')
  }
}

/**
 * Debug a formula and suggest fixes
 * @param {string} formula - The JavaScript formula to debug
 * @param {string} error - The error message
 * @param {Array} inputFields - Array of input field objects with id and label
 * @returns {Promise<{fixedFormula: string, explanation: string}>}
 */
export const debugFormula = async (formula, error, inputFields) => {
  try {
    const inputVariables = inputFields.map(field => `${field.id}: ${field.label}`).join(', ')
    
    const prompt = `
      Debug the following JavaScript formula:
      "${formula}"
      
      Error message:
      "${error}"
      
      Available input variables:
      ${inputVariables}
      
      Return a JSON object with the following structure:
      {
        "fixedFormula": "The corrected JavaScript formula",
        "explanation": "An explanation of what was wrong and how it was fixed"
      }
    `
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a formula debugging assistant that fixes JavaScript formulas.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 500,
      response_format: { type: 'json_object' }
    })
    
    const result = JSON.parse(response.choices[0].message.content)
    return result
  } catch (error) {
    console.error('Error debugging formula:', error)
    throw new Error('Failed to debug formula. Please try again.')
  }
}

