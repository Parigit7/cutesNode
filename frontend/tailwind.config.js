export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#d59ca3',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at top, rgba(213,156,163,0.18), transparent 40%), linear-gradient(180deg, #111111 0%, #090909 100%)',
      },
    },
  },
  plugins: [],
};
