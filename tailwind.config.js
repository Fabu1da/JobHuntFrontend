/** Add this to your tailwind.config.js */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // ...your existing content paths
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Fraunces", "ui-serif", "Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          DEFAULT: "#1b1e24",
          soft: "#2a2e37",
        },
        paper: {
          DEFAULT: "#faf7f1",
          dim: "#f1ede4",
        },
        forest: {
          DEFAULT: "#31584b",
          hover: "#26463b",
        },
        amber: "#d9a441",
        rust: "#b8463c",
        muted: "#7c7f86",
        border: "#e3ded2",
      },
    },
  },
  plugins: [],
};