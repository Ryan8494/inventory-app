import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                'deep': '#0F172A',
                'ink-navy': '#1B2838',
                'primary': {
                    DEFAULT: '#2563EB',
                    50: '#EFF6FF',
                    100: '#DBEAFE',
                    200: '#BFDBFE',
                    300: '#93C5FD',
                    400: '#60A5FA',
                    500: '#2563EB',
                    600: '#1D4ED8',
                    700: '#1E40AF',
                },
                'steel': '#475569',
                'chalk': '#F8FAFC',
                'line': '#E2E8F0',
                'surface': '#FFFFFF',
            },
            fontFamily: {
                sans: ['IBM Plex Sans', ...defaultTheme.fontFamily.sans],
                mono: ['IBM Plex Mono', 'Courier New', 'monospace'],
                heading: ['IBM Plex Mono', ...defaultTheme.fontFamily.mono],
            },
            borderRadius: {
                'sm': '6px',
                'DEFAULT': '8px',
                'lg': '12px',
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                'sidebar': '15rem',
            },
            boxShadow: {
                'card': '0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
                'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
            },
            keyframes: {
                'fade-in': {
                    '0%': { opacity: '0', transform: 'translateY(4px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'slide-out': {
                    '0%': { opacity: '1', transform: 'translateX(0)' },
                    '100%': { opacity: '0', transform: 'translateX(100%)' },
                },
            },
            animation: {
                'fade-in': 'fade-in 0.2s ease-out',
                'slide-out': 'slide-out 0.3s ease-in',
            },
        },
    },

    plugins: [forms],
};
