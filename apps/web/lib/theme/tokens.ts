/**
 * Centralized Visual Design Tokens (theme/tokens)
 * Math Learning Platform (Designed for Kids aged 6-7 years & Parent/Teacher oversight)
 * 
 * Includes Playful high-contrast kid-friendly colors, rounded font families,
 * standard spacing scales, playful border-radii, and isometric & soft shadows.
 */

export const DESIGN_TOKENS = {
  // 1. Playful, accessible color palette matching child cognitive preferences
  colors: {
    brand: {
      // Primary: Playful energetic indigo-violet, high contrast but joyful
      primary: '#5C59E8',
      primaryDark: '#3F3CBD',
      primaryLight: '#EEEDFF',
      
      // Secondary: Warm cheerful Honey Orange (high energy, friendly)
      secondary: '#FF9F1C',
      secondaryDark: '#E08500',
      secondaryLight: '#FFF5E6',
    },
    
    // Status color tokens (Softened for child psychology, avoiding harsh reds)
    status: {
      // Success: Gentle Clover Green, highly visible and encouraging
      success: '#2E7D32',
      successLight: '#E8F5E9',
      successBorder: '#81C784',
      
      // Error / Retry: Friendly Warm Amber/Zesty Yellow instead of scary high-alarm red
      retry: '#FFB703',
      retryLight: '#FEF9E7',
      retryBorder: '#FCD34D',
      
      // Neutral info
      info: '#0284C7',
      infoLight: '#F0F9FF',
    },

    // Cozy neutral scales
    neutral: {
      white: '#FFFFFF',
      cream: '#FCFBF7',      // Warm vanilla cozy page background
      offWhite: '#F8FAF7',   // Clean card backdrops
      charcoal: '#2D2D2D',  // High contrast readable body text for kids
      slate: '#475569',     // Readable text for helper labels/parents
      grayMuted: '#94A3B8', // Unboxed quiet metadata text
      border: '#E2E8F0',    // Clean hairline separation
    },
  },

  // 2. Playful & Clean Typography Pairings
  typography: {
    fonts: {
      // Cheerful, friendly rounded Persian fonts for kid-friendly headings
      display: 'Vazirmatn, "Yekan Bakh", system-ui, -apple-system, sans-serif',
      // Highly readable clean Persian fonts for body copy and adult dashboards
      body: 'Vazirmatn, "IRANSans", system-ui, -apple-system, sans-serif',
      // Strict tabular-nums for scores, timers, and mathematical calculations
      math: '"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace',
    },
    sizes: {
      xs: '12px',    // Muted metadata
      sm: '14px',    // Small captions / instructions
      base: '16px',  // Body text / standard readability
      lg: '18px',    // Card subheadings
      xl: '20px',    // Section headers
      xxl: '28px',   // Large gamified badges / scores
      huge: '36px',  // Mega countdowns / reward numbers
    },
    weights: {
      regular: '400',
      semibold: '600',
      bold: '800',
      black: '900',
    },
  },

  // 3. Playful Border Radius Scale (Curved edges are inviting and safe)
  radius: {
    none: '0px',
    xs: '6px',      // Micro indicators
    sm: '12px',     // Badges, small inputs
    md: '18px',     // Buttons, default interactive items
    lg: '24px',     // Main play/learning cards
    xl: '32px',     // Large rewards / onboarding sheets
    full: '9999px', // Rounded capsules
  },

  // 4. Mathematical Spacing Scale (Zero arbitrary gaps)
  spacing: {
    none: '0px',
    xs: '4px',      // Micro spacing / padding inline
    sm: '8px',      // Tight element relationship (labels/helpers)
    md: '16px',     // Standard container padding / gap between items
    lg: '24px',     // Spacious section dividers / outer padding
    xl: '32px',     // Wide page margins / heroes
    xxl: '48px',    // Massive layout boundaries
  },

  // 5. Isometric flat shadows (Duolingo-style satisfying clickable feedback) & Standard soft shadows
  shadows: {
    // Elegant standard soft elevations
    soft: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
    card: '0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
    
    // Playful Duolingo-style flat depth offset (using border-bottom shift)
    flat: {
      primary: '0 4px 0 #3F3CBD',
      secondary: '0 4px 0 #E08500',
      success: '0 4px 0 #1B5E20',
      retry: '0 4px 0 #D97706',
      neutral: '0 4px 0 #CBD5E1',
      active: 'none', // Flat button pressed state
    },
  },
};
