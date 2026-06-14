/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: { center: true },
    extend: {
      colors: {
        paper: '#F5EFE0',
        'paper-dark': '#E8DFC7',
        ink: '#2B2118',
        'ink-light': '#4A3A2A',
        sandal: '#5C3A21',
        'sandal-light': '#7A5236',
        cinnabar: '#A83232',
        'cinnabar-dark': '#8A2828',
        tea: '#6B8E5A',
        'tea-light': '#8AAD77',
        gold: '#C9A24B',
        'gold-light': '#D9B96A',
      },
      fontFamily: {
        brush: ['"ZCOOL XiaoWei"', 'serif'],
        song: ['"Noto Serif SC"', 'serif'],
      },
      boxShadow: {
        wood: 'inset 0 2px 0 rgba(255,255,255,0.15), inset 0 -2px 0 rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.2)',
        'wood-hover':
          'inset 0 2px 0 rgba(255,255,255,0.2), inset 0 -2px 0 rgba(0,0,0,0.3), 0 6px 16px rgba(0,0,0,0.3)',
        scroll: '0 0 0 2px #5C3A21, 0 0 0 6px #C9A24B, 0 8px 24px rgba(0,0,0,0.25)',
      },
      backgroundImage: {
        'paper-texture':
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 0.75 0 0 0 0 0.65 0 0 0 0 0.45 0 0 0 0.12 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        unroll: {
          '0%': { transform: 'scaleY(0.1)', opacity: 0 },
          '100%': { transform: 'scaleY(1)', opacity: 1 },
        },
        coinFall: {
          '0%': { transform: 'translateY(-20px) rotate(0)', opacity: 0 },
          '50%': { opacity: 1 },
          '100%': { transform: 'translateY(40px) rotate(360deg)', opacity: 0 },
        },
        inkWrite: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
        breathe: {
          '0%, 100%': { opacity: 0.9 },
          '50%': { opacity: 1 },
        },
      },
      animation: {
        unroll: 'unroll 0.6s ease-out',
        coinFall: 'coinFall 1.2s ease-in-out',
        inkWrite: 'inkWrite 2s ease-out',
        shake: 'shake 0.4s ease-in-out',
        breathe: 'breathe 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
