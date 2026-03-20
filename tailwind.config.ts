import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0b0a08',
          2: '#131210',
          3: '#1a1916',
        },
        surface: {
          DEFAULT: '#1f1e1b',
          2: '#2a2825',
        },
        text: {
          DEFAULT: '#f0ede6',
          muted: 'rgba(240,237,230,0.5)',
          faint: 'rgba(240,237,230,0.28)',
        },
        gold: {
          DEFAULT: '#c8a96e',
          light: '#e8d0a0',
          dark: '#8a6e3d',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.07)',
          2: 'rgba(255,255,255,0.13)',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      fontSize: {
        eyebrow: ['11px', { letterSpacing: '0.25em' }],
      },
      animation: {
        'marquee': 'marquee 24s linear infinite',
        'scroll-line': 'scroll-line 2s ease-in-out infinite',
        'fade-up': 'fade-up 0.7s ease forwards',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'scroll-line': {
          '0%': { opacity: '0', transform: 'scaleY(0)', transformOrigin: 'top' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'scaleY(1)', transformOrigin: 'bottom' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
}

export default config
