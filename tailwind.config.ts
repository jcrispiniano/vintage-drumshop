import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B4513',
        secondary: '#D2691E',
        accent: '#FF6B35',
        darkBg: '#2C1810',
        lightBg: '#F5E6D3',
      },
    },
  },
  plugins: [],
};
export default config;