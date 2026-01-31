'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#0f172a', // Slate 900 (Navy Blue)
            light: '#334155', // Slate 700
            dark: '#020617', // Slate 950
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#f59e0b', // Amber 500
            light: '#fcd34d', // Amber 300
            dark: '#b45309', // Amber 700
            contrastText: '#0f172a',
        },
        background: {
            default: '#f8fafc', // Slate 50
            paper: '#ffffff',
        },
        text: {
            primary: '#0f172a', // Slate 900
            secondary: '#64748b', // Slate 500
        },
        grey: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151',
            800: '#1f2937',
            900: '#111827',
        },
    },
    typography: {
        fontFamily: 'var(--font-inter), sans-serif',
        h1: {
            fontWeight: 800,
            letterSpacing: '-0.025em',
        },
        h2: {
            fontWeight: 700,
            letterSpacing: '-0.025em',
        },
        h3: {
            fontWeight: 700,
            letterSpacing: '-0.025em',
        },
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
        button: {
            fontWeight: 600,
            textTransform: 'none',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    },
                },
                containedSecondary: {
                    color: '#0f172a', // Ensure contrast on amber buttons
                }
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '1rem',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                }
            }
        },
        MuiContainer: {
            styleOverrides: {
                root: {
                    paddingLeft: '1.5rem',
                    paddingRight: '1.5rem',
                    '@media (min-width: 600px)': {
                        paddingLeft: '2rem',
                        paddingRight: '2rem',
                    },
                }
            }
        }
    },
});

export default theme;
