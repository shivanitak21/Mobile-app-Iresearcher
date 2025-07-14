export const lightTheme = {
  colors: {
    primary: '#3B82F6', // blue
    secondary: '#60A5FA', // lighter blue
    accent: '#E0E7EF', // light gray
    background: '#F6F8FB', // very light gray
    surface: '#F0F4F8', // lighter surface
    card: 'rgba(255,255,255,0.7)', // glassy white
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#D1D5DB', // lighter border
    success: '#3B82F6', // blue for success
    warning: '#60A5FA', // blue for warning
    error: '#E0E7EF', // light gray for error
    shadow: 'rgba(59, 130, 246, 0.10)', // blue shadow
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      fontFamily: 'Inter-Bold',
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600' as const,
      fontFamily: 'Inter-SemiBold',
      lineHeight: 32,
    },
    h3: {
      fontSize: 18,
      fontWeight: '600' as const,
      fontFamily: 'Inter-SemiBold',
      lineHeight: 24,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      fontFamily: 'Inter-Regular',
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400' as const,
      fontFamily: 'Inter-Regular',
      lineHeight: 20,
    },
  },
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#3B82F6',
    secondary: '#60A5FA',
    background: '#1E293B',
    surface: '#273449',
    card: 'rgba(30,41,59,0.7)',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    border: '#334155',
    shadow: 'rgba(59, 130, 246, 0.20)',
  },
};