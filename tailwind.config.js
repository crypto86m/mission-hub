/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0A0A0A',
        'dark-card': '#1a1a1a',
        'cyan': '#00D4FF',
        'cyan-dark': '#00a3cc',
        'neon-green': '#00ff41',
        'accent-purple': '#8b5cf6',
        'accent-blue': '#3b82f6',
        'accent-orange': '#ff6b35',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 212, 255, 0.3)',
        'glow-strong': '0 0 40px rgba(0, 212, 255, 0.5)',
        'glow-green': '0 0 15px rgba(0, 255, 65, 0.3)',
      },
      keyframes: {
        'orbit': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'orbit': 'orbit 20s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
