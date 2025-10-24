import React from 'react';
import { theme } from './theme';

const GlobalStyles = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: ${theme.typography.fontFamily};
        background: ${theme.colors.background.primary};
        color: ${theme.colors.text.primary};
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      #root {
        min-height: 100vh;
      }
      
      /* Custom scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: ${theme.colors.background.secondary};
      }
      
      ::-webkit-scrollbar-thumb {
        background: ${theme.colors.primary.main};
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: ${theme.colors.primary.dark};
      }
      
      /* Selection */
      ::selection {
        background: ${theme.colors.primary.main};
        color: white;
      }
    `}
  </style>
);

export default GlobalStyles;