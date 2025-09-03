import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import CalculatorRenderer from '../components/calculator/CalculatorRenderer';

const PreviewCalculator = () => {
  const { calculatorId } = useParams();
  const { user } = useAuth();
  const [calculator, setCalculator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCalculator = async () => {
      try {
        setLoading(true);
        // In a real implementation, this would fetch from an API
        // For now, we'll simulate a fetch with a timeout
        setTimeout(() => {
          // Mock data for preview
          const mockCalculator = {
            id: calculatorId,
            title: 'Sample Calculator',
            description: 'This is a preview of your calculator',
            formula: 'a + b * c',
            inputs: [
              { id: 'a', label: 'Value A', type: 'number', defaultValue: 5 },
              { id: 'b', label: 'Value B', type: 'number', defaultValue: 10 },
              { id: 'c', label: 'Value C', type: 'number', defaultValue: 2 }
            ],
            outputs: [
              { id: 'result', label: 'Result', formula: 'a + b * c' }
            ],
            theme: {
              primaryColor: '#3f51b5',
              backgroundColor: '#ffffff',
              textColor: '#000000'
            }
          };
          
          setCalculator(mockCalculator);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching calculator:', err);
        setError('Failed to load calculator. Please try again later.');
        setLoading(false);
      }
    };

    fetchCalculator();
  }, [calculatorId]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading calculator preview...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!calculator) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">Calculator not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {calculator.title}
        </Typography>
        <Typography variant="body1" paragraph>
          {calculator.description}
        </Typography>
        
        <Box sx={{ mt: 4 }}>
          <CalculatorRenderer calculator={calculator} previewMode={true} />
        </Box>
      </Paper>
      
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
        This is a preview of how your calculator will appear to users.
      </Typography>
    </Container>
  );
};

export default PreviewCalculator;

