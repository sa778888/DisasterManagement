/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#000000", // Black as the primary color
        darkBg: "#000000",  // Ensuring deep black background
      },
      backgroundColor: {
        DEFAULT: "#000000", // Set default background color to black
      },
    },
  },
  plugins: [],
};
