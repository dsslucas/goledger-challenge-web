/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        success: "#28a745",
        info: "#007bff",
        edit: "#ffc107",
        delete: "#dc3545"
      },
    },
    screens:{
      xs: '320px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      // '2xl': '1536px'
    },
  },
  plugins: [],
}
