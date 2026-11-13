/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#F0F7F4',
          100: '#E0EFE9',
          200: '#C2DFD3',
          300: '#94C7B3',
          400: '#5EA78D',
          500: '#3A896F',
          600: '#2A6E58',
          700: '#205646',
          800: '#174236',
          900: '#0F3E2E',
          950: '#08231A',
        },
        warm: {
          50: '#FDF8F3',
          100: '#FBF0E4',
          200: '#F5DEBE',
          300: '#ECC491',
          400: '#E1A25B',
          500: '#D97706',
          600: '#B45309',
          700: '#92400E',
          800: '#78350F',
          900: '#451A03',
        },
        surface: {
          sand: '#FAF8F5',
          card: '#FFFFFF',
          subtle: '#F4EFEA',
          border: '#E8E2D9',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card-subtle': '0 2px 8px -2px rgba(15, 62, 46, 0.06), 0 1px 4px -1px rgba(15, 62, 46, 0.04)',
        'card-hover': '0 8px 24px -4px rgba(15, 62, 46, 0.12), 0 4px 12px -2px rgba(15, 62, 46, 0.06)',
        'float-bottom': '0 -4px 20px -2px rgba(15, 62, 46, 0.08)',
      },
    },
  },
  plugins: [],
};
