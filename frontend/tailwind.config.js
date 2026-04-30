export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#a53973',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at top, rgba(165, 57, 115, 0.18), transparent 40%), linear-gradient(180deg, #111111 0%, #090909 100%)',
      },
    },
  },
  plugins: [],
};
