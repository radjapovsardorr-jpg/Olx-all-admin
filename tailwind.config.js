/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        olx: {
          dark: '#08201a',
          sidebar: '#0b2620',
          sidebarHover: '#133930',
          sidebarActive: '#17473c',
          badge: '#002f27',
          teal: '#00DF81',
          mint: '#10b981',
          cyan: '#06b6d4',
          yellow: '#f5b324',
          yellowHover: '#e0a11c',
          gold: '#eab308',
          red: '#ef4444',
          redLight: '#fef2f2',
          redBorder: '#fee2e2',
          bg: '#f6f9f8',
          card: '#ffffff',
          subtle: '#64748b',
          border: '#e2e8f0',
          borderDark: '#1c4a40'
        }
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glow-teal': '0 0 25px rgba(0, 223, 129, 0.25)',
        'glow-yellow': '0 0 25px rgba(245, 179, 36, 0.3)'
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
};
