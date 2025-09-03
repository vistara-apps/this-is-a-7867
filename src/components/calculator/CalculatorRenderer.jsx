import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Typography, 
  Paper, 
  Grid, 
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel
} from '@mui/material';

const CalculatorRenderer = ({ calculator, previewMode = false }) => {
  const [inputValues, setInputValues] = useState({});
  const [outputValues, setOutputValues] = useState({});
  const [calculationPerformed, setCalculationPerformed] = useState(false);

  // Initialize input values with defaults
  useEffect(() => {
    if (calculator && calculator.inputs) {
      const initialValues = {};
      calculator.inputs.forEach(input => {
        initialValues[input.id] = input.defaultValue || '';
      });
      setInputValues(initialValues);
    }
  }, [calculator]);

  const handleInputChange = (inputId, value) => {
    setInputValues(prev => ({
      ...prev,
      [inputId]: value
    }));
    
    // If auto-calculate is enabled, we would recalculate here
    if (previewMode) {
      calculateOutputs();
    }
  };

  const calculateOutputs = () => {
    if (!calculator || !calculator.outputs) return;

    const results = {};
    
    // Simple formula evaluation for demo purposes
    // In a real app, you would use a proper formula parser/evaluator
    calculator.outputs.forEach(output => {
      try {
        // This is a simplified approach - in production, use a proper formula parser
        // that handles the formula safely
        let formula = output.formula;
        
        // Replace input variables with their values
        Object.keys(inputValues).forEach(inputId => {
          const regex = new RegExp(`\\b${inputId}\\b`, 'g');
          formula = formula.replace(regex, inputValues[inputId] || 0);
        });
        
        // Very basic evaluation - NOT safe for production!
        // eslint-disable-next-line no-eval
        const result = eval(formula);
        results[output.id] = isNaN(result) ? 'Error' : result;
      } catch (error) {
        console.error('Error calculating formula:', error);
        results[output.id] = 'Error';
      }
    });
    
    setOutputValues(results);
    setCalculationPerformed(true);
  };

  const renderInputField = (input) => {
    switch (input.type) {
      case 'number':
        return (
          <TextField
            fullWidth
            label={input.label}
            type="number"
            value={inputValues[input.id] || ''}
            onChange={(e) => handleInputChange(input.id, parseFloat(e.target.value) || 0)}
            margin="normal"
            variant="outlined"
            helperText={input.description}
          />
        );
        
      case 'select':
        return (
          <FormControl fullWidth margin="normal">
            <InputLabel>{input.label}</InputLabel>
            <Select
              value={inputValues[input.id] || ''}
              onChange={(e) => handleInputChange(input.id, e.target.value)}
              label={input.label}
            >
              {input.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
        
      case 'slider':
        return (
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography gutterBottom>{input.label}</Typography>
            <Slider
              value={inputValues[input.id] || input.min || 0}
              onChange={(_, value) => handleInputChange(input.id, value)}
              min={input.min || 0}
              max={input.max || 100}
              step={input.step || 1}
              valueLabelDisplay="auto"
              marks={input.marks}
            />
            {input.description && (
              <Typography variant="caption" color="text.secondary">
                {input.description}
              </Typography>
            )}
          </Box>
        );
        
      case 'boolean':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={!!inputValues[input.id]}
                onChange={(e) => handleInputChange(input.id, e.target.checked)}
              />
            }
            label={input.label}
            sx={{ my: 1 }}
          />
        );
        
      default:
        return (
          <TextField
            fullWidth
            label={input.label}
            value={inputValues[input.id] || ''}
            onChange={(e) => handleInputChange(input.id, e.target.value)}
            margin="normal"
            variant="outlined"
            helperText={input.description}
          />
        );
    }
  };

  if (!calculator) {
    return <Typography>No calculator data available</Typography>;
  }

  return (
    <Box>
      <Paper elevation={previewMode ? 0 : 2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Inputs
        </Typography>
        
        <Grid container spacing={2}>
          {calculator.inputs?.map((input) => (
            <Grid item xs={12} sm={6} key={input.id}>
              {renderInputField(input)}
            </Grid>
          ))}
        </Grid>
        
        {!previewMode && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={calculateOutputs}
              size="large"
            >
              Calculate
            </Button>
          </Box>
        )}
      </Paper>

      {(calculationPerformed || previewMode) && (
        <Paper elevation={previewMode ? 0 : 2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Results
          </Typography>
          
          <Grid container spacing={3}>
            {calculator.outputs?.map((output) => (
              <Grid item xs={12} sm={6} key={output.id}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" color="text.secondary">
                    {output.label}
                  </Typography>
                  <Typography variant="h5">
                    {outputValues[output.id] !== undefined 
                      ? outputValues[output.id] 
                      : 'Not calculated'}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default CalculatorRenderer;

