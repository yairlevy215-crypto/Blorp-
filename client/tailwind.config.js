/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"VT323"', 'monospace'],
        sans: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float-up': 'floatUp 2.5s ease-out forwards',
        'marquee':  'marquee 40s linear infinite',
      },
      keyframes: {
        floatUp: {
          '0%':   { opacity: '1', transform: 'translateY(0px)' },
          '100%': { opacity: '0', transform: 'translateY(-80px)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(100vw)' },
          '100%': { transform: 'translateX(-200%)' },
        },
      },
    },
  },
  plugins: [],
}
