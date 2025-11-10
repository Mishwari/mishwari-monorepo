const { 
  brandColors, 
  grayScale, 
  shadcnColors, 
  typography, 
  borderRadius, 
  backgroundImage 
} = require('./src/theme/tokens');

module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: brandColors,
        gray: grayScale,
        ...shadcnColors,
      },
      ...typography,
      borderRadius,
      backgroundImage,
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
};
