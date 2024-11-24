/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'media',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        gray:{
          10:"#F5F5F5",
          150:"#e3e2e2"
        },
        nikblue:{
          DEFAULT:"#2053F8",
          light:"#537BFF"
        }
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

