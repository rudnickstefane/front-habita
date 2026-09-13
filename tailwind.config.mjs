/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1f6f5b",
          50: "#f1f8f5",
          100: "#dceee6",
          500: "#1f6f5b",
          700: "#155445",
        },
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
