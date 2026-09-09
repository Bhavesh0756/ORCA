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
        orca: {
          bg:        "#06131C",
          sidebar:   "#071922",
          surface:   "#0A202B",
          elevated:  "#0E2936",
          border:    "#173845",
          primary:   "#18D5D0",
          secondary: "#55C7FF",
          text:      "#F4FAFC",
          muted:     "#819CA8",
          risk:      "#FF405C",
          warning:   "#FFB020",
          safe:      "#19D98A",
          restricted:"#9274FF",
        }
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scan-vertical': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0) rotate(-1deg)' },
          '50%': { transform: 'translateY(-20px) rotate(1deg)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'scan-vertical': 'scan-vertical 3s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
