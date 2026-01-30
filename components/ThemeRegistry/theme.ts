'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#0f172a', // Slate 900
        },
        secondary: {
            main: '#f59e0b', // Amber 500
        },
        background: {
            default: '#ffffff',
            paper: '#f8fafc', // Slate 50
        },
    },
    typography: {
        fontFamily: 'var(--font-inter)',
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 600,
        },
        h3: {
            fontWeight: 600,
        },
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 500,
        },
        h6: {
            fontWeight: 500,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '0.5rem',
                },
            },
        },
    },
});

export default theme;
