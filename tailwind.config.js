/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        black: "#000000",
        primary: "#3B82F6",
        alert: "#ff4444",
        warning: "#ffb84d",
        success: "#4caf50",
        textDescription: "#4b5563",
        textLabel: "#a6acb7",
        iconColor: "#555555",
        cardBackground: "#E0E0E0",
        shadowColor: "#000000",
      },
      fontSize: {
        headerTitle: "24px",
        iconSize: "24px",
        userIconSize: "20px",
      },
    },
  },
  plugins: [],
};
