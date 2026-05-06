export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT: '#F5B800', dark: '#D4A000', light: '#FFD750' },
        orange: { DEFAULT: '#E07B20', dark: '#C06010', light: '#F09840' },
        site: {
          black: '#0A0A0A',
          dark: '#1A1A1A',
          gray: '#2A2A2A',
          light: '#F5F5F0'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Myanmar', 'Noto Sans Thai', 'sans-serif'],
        heading: ['Barlow', 'Inter', 'sans-serif']
      }
    }
  },
  plugins: []
};
