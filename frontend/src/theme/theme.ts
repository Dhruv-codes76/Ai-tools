import { createTheme } from '@mui/material/styles';

const commonSettings = {
    typography: {
        fontFamily: 'var(--font-inter), sans-serif',
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 0,
                },
            },
        },
    },
};

export const lightTheme = createTheme({
    ...commonSettings,
    palette: {
        mode: 'light',
        primary: {
            main: '#171717',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#E5E5E5',
            contrastText: '#171717',
        },
        text: {
            primary: '#171717',
            secondary: '#737373',
        },
        background: {
            default: '#FFFFFF',
            paper: '#FFFFFF',
        },
        divider: '#E5E5E5',
    },
});

export const darkTheme = createTheme({
    ...commonSettings,
    palette: {
        mode: 'dark',
        primary: {
            main: '#ededed',
            contrastText: '#0a0a0a',
        },
        secondary: {
            main: '#262626',
            contrastText: '#ededed',
        },
        text: {
            primary: '#ededed',
            secondary: '#a3a3a3',
        },
        background: {
            default: '#0a0a0a',
            paper: '#171717',
        },
        divider: '#262626',
    },
});
