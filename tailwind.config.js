/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sh-green': '#21a551',    // Verde Oficial
        'sh-black': '#000000',    // Preto Fundo
        'sh-neon': '#d7f205',     // Verde Limão/Destaque
      },
      fontFamily: {
        'urban': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}