// src/styles/theme.js
export const theme = {
  colors: {
    primary: {
      main: '#667eea',
      light: '#764ba2',
      dark: '#5a6fd8',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    secondary: {
      main: '#f093fb',
      light: '#f5576c',
      dark: '#ee7df7',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    accent: {
      main: '#4facfe',
      light: '#00f2fe',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    success: {
      main: '#4ade80',
      light: '#86efac',
      dark: '#16a34a'
    },
    warning: {
      main: '#f59e0b',
      light: '#fcd34d',
      dark: '#d97706'
    },
    error: {
      main: '#ef4444',
      light: '#fca5a5',
      dark: '#dc2626'
    },
    background: {
      primary: '#0f172a',
      secondary: '#1e293b',
      card: 'rgba(30, 41, 59, 0.8)',
      surface: 'rgba(15, 23, 42, 0.6)',
      overlay: 'rgba(0, 0, 0, 0.5)'
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      muted: '#64748b',
      inverted: '#0f172a'
    },
    border: {
      light: 'rgba(255, 255, 255, 0.1)',
      medium: 'rgba(255, 255, 255, 0.2)',
      heavy: 'rgba(255, 255, 255, 0.3)'
    }
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px'
  },
  
  borderRadius: {
    sm: '6px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '9999px'
  },
  
  shadows: {
    sm: '0 2px 8px rgba(0,0,0,0.1)',
    md: '0 4px 16px rgba(0,0,0,0.2)',
    lg: '0 8px 32px rgba(0,0,0,0.3)',
    xl: '0 16px 48px rgba(0,0,0,0.4)',
    glow: {
      primary: '0 4px 20px rgba(102, 126, 234, 0.4)',
      secondary: '0 4px 20px rgba(240, 147, 251, 0.4)',
      accent: '0 4px 20px rgba(79, 172, 254, 0.4)'
    }
  },
  
  typography: {
     fontFamily: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      mono: "'JetBrains Mono', 'Fira Code', Consolas, monospace"
    },
    h1: {
      fontSize: '3rem',
      fontWeight: '800',
      lineHeight: '1.2'
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: '700',
      lineHeight: '1.3'
    },
    h3: {
      fontSize: '2rem',
      fontWeight: '600',
      lineHeight: '1.4'
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: '600',
      lineHeight: '1.4'
    },
    body: {
      fontSize: '1rem',
      fontWeight: '400',
      lineHeight: '1.6'
    },
    caption: {
      fontSize: '0.875rem',
      fontWeight: '400',
      lineHeight: '1.4'
    }
  },
  
  animations: {
    hover: 'all 0.3s ease',
    focus: 'all 0.2s ease',
    slide: 'all 0.5s ease'
  },
  
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    accent: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    dark: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    overlay: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%)'
  }
};