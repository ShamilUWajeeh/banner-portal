import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2E8BC0',
          darkBlue: '#003366',
          yellow: '#FFEB3B',
          green: '#28a745',
        }
      },
      backgroundImage: {
        'poster-gradient': 'linear-gradient(180deg, #2E8BC0 0%, #0056b3 60%, #003366 100%)',
      },
    },
  },
  plugins: [],
};
export default config;