/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "bounce-dot": {
          "0%, 80%, 100%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "bounce-dot-1": "bounce-dot 1s infinite",
        "bounce-dot-2": "bounce-dot 1s 0.2s infinite",
        "bounce-dot-3": "bounce-dot 1s 0.4s infinite",
      },
    },
  },
  plugins: [],
};
