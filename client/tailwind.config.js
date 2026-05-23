/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        neon: '#00ff88',
        hot: '#ff0066',
        dark: '#0a0a0f',
        darker: '#05050a',
        card: '#13131a',
        border: '#1e1e2e',
        muted: '#6b6b8a',
        dim: '#2a2a3e',
      },
      fontFamily: {
        glitch: ['"VT323"', 'monospace'],
        sans: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float-up': 'floatUp 2.5s ease-out forwards',
        'glitch': 'glitch 0.25s infinite',
        'glitch-slow': 'glitch 0.8s infinite',
        'marquee': 'marquee 35s linear infinite',
        'vibe-pulse': 'vibePulse 2s ease-in-out infinite',
        'score-pop': 'scorePop 0.3s ease-out',
        'shake': 'shake 0.4s ease-in-out',
      },
      keyframes: {
        floatUp: {
          '0%':   { opacity: '1', transform: 'translateY(0px) scale(1)' },
          '20%':  { opacity: '1', transform: 'translateY(-20px) scale(1.1)' },
          '100%': { opacity: '0', transform: 'translateY(-100px) scale(0.8)' },
        },
        glitch: {
          '0%, 100%': { textShadow: '2px 0 #ff0066, -2px 0 #00ff88' },
          '33%':       { textShadow: '-3px 0 #ff0066, 3px 0 #00ff88, 0 0 8px #ff0066' },
          '66%':       { textShadow: '3px 2px #ff0066, -3px -2px #00ff88' },
        },
        marquee: {
          '0%':   { transform: 'translateX(100vw)' },
          '100%': { transform: 'translateX(-200%)' },
        },
        vibePulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.6', transform: 'scale(0.97)' },
        },
        scorePop: {
          '0%':   { transform: 'scale(1)' },
          '50%':  { transform: 'scale(1.4)' },
          '100%': { transform: 'scale(1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%':      { transform: 'translateX(-4px)' },
          '40%':      { transform: 'translateX(4px)' },
          '60%':      { transform: 'translateX(-4px)' },
          '80%':      { transform: 'translateX(4px)' },
        },
      },
    },
  },
  plugins: [],
}
