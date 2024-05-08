import { nextui } from '@nextui-org/react';

const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
        './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        extend: {
            transitionDelay: {
                0: '0ms',
                250: '250ms',
                500: '500ms',
                750: '750ms',
                1000: '1000ms',
                2000: '2000ms',
                2500: '2500ms',
                3000: '3000ms',
                3500: '3500ms',
                4000: '4000ms'
            },
            animation: {
                fadeIn: 'fadeIn 500ms ease-in-out forwards'
            },
            keyframes: {
                fadeIn: {
                    from: { opacity: 0, transform: 'translateY(30px)' },
                    to: { opacity: 1, transform: 'translateY(0)' }
                }
            },
            fontFamily: {
                sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
                serif: defaultTheme.fontFamily.serif,
                mono: defaultTheme.fontFamily.mono
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: 'hsl(var(--nextui-foreground))',
                        maxWidth: 'none',
                        hr: {
                            marginTop: '2em',
                            marginBottom: '2em'
                        },
                        'h1, h2, h3': {
                            letterSpacing: '-0.025em'
                        },
                        h2: {
                            marginTop: '1.5em',
                            marginBottom: `${16 / 24}em`
                        },
                        h3: {
                            marginTop: '1.8em',
                            lineHeight: '1.4'
                        },
                        h4: {
                            marginTop: '2em',
                            fontSize: '1.125em'
                        },
                        'h2 a': {
                            fontSize: `${theme('fontSize.2xl')[0]} !important`,
                            fontWeight: theme('fontWeight.semibold'),
                            ...theme('fontSize.2xl')[1]
                        },
                        'h3 a': {
                            fontSize: '1.25rem !important',
                            fontWeight: theme('fontWeight.medium')
                        },
                        'h2 small, h3 small, h4 small': {
                            fontFamily: theme('fontFamily.mono').join(', '),
                            color: theme('colors.slate.500'),
                            fontWeight: 500
                        },
                        'h2 small': {
                            fontSize: theme('fontSize.lg')[0],
                            ...theme('fontSize.lg')[1]
                        },
                        'h3 small': {
                            fontSize: theme('fontSize.base')[0],
                            ...theme('fontSize.base')[1]
                        },
                        'h4 small': {
                            fontSize: theme('fontSize.sm')[0],
                            ...theme('fontSize.sm')[1]
                        },
                        'h2, h3, h4': {
                            'scroll-margin-top': 'var(--scroll-mt)'
                        },
                        ul: {
                            listStyleType: 'none',
                            paddingLeft: 0
                        },
                        'ul > li': {
                            marginTop: '0.1em',
                            marginBottom: '0.1em',
                            fontWeight: theme('fontWeight.normal')
                        },
                        'ul > li > *:last-child': {
                            marginTop: 0,
                            marginBottom: 0
                        },
                        'ul > li > a': {
                            marginTop: '0',
                            marginBottom: '0'
                        },
                        a: {
                            fontWeight: theme('fontWeight.normal')
                        },
                        'a code': {
                            color: 'inherit',
                            fontWeight: 'inherit'
                        },
                        strong: {
                            color: theme('colors.cyan.600'),
                            fontWeight: theme('fontWeight.semibold')
                        },
                        'a strong': {
                            color: 'inherit',
                            fontWeight: 'inherit'
                        },
                        kbd: {
                            fontSize: '0.875em',
                            fontVariantLigatures: 'none',
                            borderRadius: '4px',
                            margin: '0 1px'
                        },
                        code: {
                            fontWeight: theme('fontWeight.medium'),
                            fontVariantLigatures: 'none'
                        },
                        pre: {
                            display: 'flex',
                            fontSize: theme('fontSize.sm')[0],
                            backgroundColor: 'transparent',
                            fontWeight: theme('fontWeight.light'),
                            padding: 0,
                            margin: 0
                        },
                        p: {
                            marginTop: `${12 / 14}em`,
                            marginBottom: `${12 / 14}em`,
                            fontWeight: theme('fontWeight.normal')
                        },
                        'pre code': {
                            flex: 'none',
                            minWidth: '100%'
                        },
                        table: {
                            marginTop: '0px',
                            fontSize: theme('fontSize.sm')[0],
                            lineHeight: theme('fontSize.sm')[1].lineHeight
                        },
                        thead: {
                            border: 'none'
                        },
                        'thead th': {
                            paddingTop: 0,
                            fontWeight: theme('fontWeight.semibold')
                        },
                        'tbody tr': {
                            border: 'none'
                        },
                        'tbody tr:last-child': {
                            border: 'none'
                        },
                        'figure figcaption': {
                            textAlign: 'center',
                            fontStyle: 'italic'
                        },
                        'figure > figcaption': {
                            marginTop: `${12 / 14}em`
                        },
                        blockquote: {
                            fontWeight: theme('fontWeight.normal'),
                            fontStyle: 'font-normal'
                        },
                        'blockquote p:first-of-type::before': {
                            content: ''
                        },
                        'blockquote p:last-of-type::after': {
                            content: ''
                        }
                    }
                }
            })
        }
    },
    darkMode: 'class',
    plugins: [
        require('@tailwindcss/typography'),
        nextui({
            addCommonColors: true
        })
    ]
};
