import type { Config } from "tailwindcss"
import tailwindcssAnimate from "tailwindcss-animate"

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
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'Monaco', 'monospace'],
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
        // SF風カラーパレット
        'sf-bg': {
          primary: '#0a0a0f',
          secondary: '#0d1117',
          tertiary: '#161b22',
        },
        'sf-text': {
          primary: '#ffffff',
          secondary: '#c9d1d9',
          muted: '#8b949e',
        },
        'sf-cyan': {
          DEFAULT: '#00ffff',
          dark: '#00cccc',
        },
        'sf-green': {
          DEFAULT: '#00ff88',
          dark: '#00cc6a',
        },
        'sf-magenta': '#ff00ff',
        'sf-orange': '#ff6b00',
        'sf-purple': '#9945ff',
        'sf-error': '#ff4444',
        'sf-warning': '#ffaa00',
        // ネオンカラー
        'neon-pink': '#FF10F0',
        'neon-blue': '#00D4FF',
        'neon-green': '#39FF14',
        'neon-purple': '#B026FF',
        'neon-orange': '#FF6B35',
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
        },
        // SF風アニメーション
        'sf-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'sf-glitch': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-1px, 1px)' },
          '40%': { transform: 'translate(-1px, -1px)' },
          '60%': { transform: 'translate(1px, 1px)' },
          '80%': { transform: 'translate(1px, -1px)' },
        },
        'holo-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'neon-pulse': {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.8', filter: 'brightness(1.2)' },
        },
        'sf-grid-move': {
          '0%': { backgroundPosition: '-1px -1px' },
          '100%': { backgroundPosition: '49px 49px' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-gentle": "pulse-gentle 3s ease-in-out infinite",
        "float": "float 12s cubic-bezier(0.25, 0.1, 0.25, 1) infinite",
        // SF風アニメーション
        'sf-pulse': 'sf-pulse 2s ease-in-out infinite',
        'sf-glitch': 'sf-glitch 0.3s ease-in-out infinite',
        'holo-shift': 'holo-shift 3s ease-in-out infinite',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'sf-grid': 'sf-grid-move 20s linear infinite',
      },
      boxShadow: {
        'brand': '0 4px 14px rgba(255, 51, 102, 0.25)',
        'brand-hover': '0 6px 20px rgba(255, 51, 102, 0.35)',
        // SF風グローエフェクト
        'sf-glow': '0 0 20px rgba(0, 255, 255, 0.3)',
        'sf-glow-sm': '0 0 10px rgba(0, 255, 255, 0.2)',
        'sf-glow-lg': '0 0 30px rgba(0, 255, 255, 0.5), 0 0 60px rgba(0, 255, 255, 0.3)',
        'sf-glow-green': '0 0 20px rgba(0, 255, 136, 0.3)',
        'sf-glow-magenta': '0 0 20px rgba(255, 0, 255, 0.3)',
        'sf-glow-orange': '0 0 20px rgba(255, 107, 0, 0.3)',
        'sf-glow-purple': '0 0 20px rgba(153, 69, 255, 0.3)',
        'sf-inner': 'inset 0 0 20px rgba(0, 255, 255, 0.1)',
        // ネオングロー
        'neon-glow-pink': '0 0 20px rgba(255, 16, 240, 0.5), 0 0 40px rgba(255, 16, 240, 0.3)',
        'neon-glow-blue': '0 0 20px rgba(0, 212, 255, 0.5), 0 0 40px rgba(0, 212, 255, 0.3)',
        'neon-glow-green': '0 0 20px rgba(57, 255, 20, 0.5), 0 0 40px rgba(57, 255, 20, 0.3)',
        'holographic': '0 0 30px rgba(255, 16, 240, 0.3), 0 0 60px rgba(0, 212, 255, 0.2)',
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
  ],
} satisfies Config

export default config
