/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // --- Legacy tokens (kept so the internal admin panel keeps rendering) ---
        gold: { DEFAULT: '#F5B800', dark: '#D4A000', light: '#FFD750' },
        orange: { DEFAULT: '#E07B20', dark: '#C06010', light: '#F09840' },
        site: { black: '#0A0A0A', dark: '#1A1A1A', gray: '#2A2A2A', light: '#F5F5F0' },

        // --- "Editorial Dawn" — the new public palette ---
        paper: { DEFAULT: '#FBF6EE', deep: '#F2E7D5' },
        surface: '#FFFFFF',
        ink: { DEFAULT: '#241B14', soft: '#4C4138', muted: '#8B7C6B' },
        sun: { DEFAULT: '#F2A100', deep: '#DC8400', soft: '#FAC85F' },
        ember: { DEFAULT: '#D6562A', deep: '#B84115' },
        espresso: { DEFAULT: '#211610', light: '#33241A' },
        line: { DEFAULT: '#EADBC6', strong: '#D7C1A2' }
      },
      fontFamily: {
        sans: ['Hanken Grotesk', 'Noto Sans Myanmar', 'Noto Sans Thai', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Noto Sans Myanmar', 'Noto Sans Thai', 'Georgia', 'serif'],
        // legacy alias used by the admin layout
        heading: ['Fraunces', 'Hanken Grotesk', 'serif']
      },
      letterSpacing: {
        eyebrow: '0.22em'
      },
      borderRadius: {
        card: '14px'
      },
      maxWidth: {
        shell: '76rem',
        prose: '46rem'
      },
      boxShadow: {
        warm: '0 1px 2px rgba(33,22,16,0.04), 0 14px 34px -16px rgba(33,22,16,0.20)',
        lift: '0 2px 4px rgba(33,22,16,0.05), 0 30px 60px -22px rgba(33,22,16,0.30)',
        sun: '0 18px 50px -16px rgba(220,132,0,0.55)',
        inset: 'inset 0 0 0 1px rgba(33,22,16,0.06)'
      },
      transitionTimingFunction: {
        dawn: 'cubic-bezier(0.22, 1, 0.36, 1)'
      },
      keyframes: {
        rise: {
          '0%': { transform: 'translateY(58%) scale(0.82)', opacity: '0' },
          '60%': { opacity: '1' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' }
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)', filter: 'brightness(1)' },
          '50%': { transform: 'scale(1.035)', filter: 'brightness(1.06)' }
        },
        rays: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        }
      },
      animation: {
        rise: 'rise 1.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        breathe: 'breathe 7s ease-in-out infinite',
        rays: 'rays 90s linear infinite',
        float: 'float 6s ease-in-out infinite',
        marquee: 'marquee 38s linear infinite'
      }
    }
  },
  plugins: []
};
