import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        youtube: {
          red: "#FF0000",
          black: "#282828",
          white: "#FFFFFF",
        },
        brand: {
          pink: "#FF3366",
          blue: "#3A86FF",
          yellow: "#FFD60A",
          purple: "#9B51E0",
          turquoise: "#0CC08E",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-gentle": {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        "float": {
          '0%': { transform: 'translateY(0)' },
          '25%': { transform: 'translateY(-5px)' },
          '50%': { transform: 'translateY(-10px)' },
          '75%': { transform: 'translateY(-5px)' },
          '100%': { transform: 'translateY(0)' },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-gentle": "pulse-gentle 3s ease-in-out infinite",
        "float": "float 12s cubic-bezier(0.25, 0.1, 0.25, 1) infinite",
      },
      boxShadow: {
        'brand': '0 4px 14px rgba(255, 51, 102, 0.25)',
        'brand-hover': '0 6px 20px rgba(255, 51, 102, 0.35)',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/line-clamp')
  ],
} satisfies Config

export default config

