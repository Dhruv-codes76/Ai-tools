"use client";

import { ThemeProvider } from '@mui/material/styles';
import { useTheme } from 'next-themes';
import { lightTheme, darkTheme } from '@/theme/theme';
import { useEffect, useState } from 'react';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line
        setMounted(true);
    }, []);

    // Wait until mounted to avoid hydration mismatch
    if (!mounted) {
        return <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>;
    }

    const theme = resolvedTheme === 'light' ? lightTheme : darkTheme;

    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    );
}
