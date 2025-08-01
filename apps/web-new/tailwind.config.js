/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeInOut: {
          "0%, 100%": { opacity: "0" },
          "16.67%, 83.33%": { opacity: "1" },
        },
      },
      animation: {
        fadeInOut: "fadeInOut 36s infinite",
      },
    },
  },
  plugins: [],
};
