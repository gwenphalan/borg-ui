/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Point Tailwind's color names to your CSS variables
        "background-default": "var(--background-default)",
        "background-elevated": "var(--background-elevated)",
        "border-default": "var(--border-default)",
        "content-primary": "var(--content-primary)",
        "content-secondary": "var(--content-secondary)",
        "interactive-accentfocus": "var(--interactive-accentfocus)",
        "status-error": "var(--status-error)", // Now .bg-status-error will use var(--status-error)
        "status-info": "var(--status-info)",
        "status-warning": "var(--status-warning)",
        "surface-default": "var(--surface-default)",
        "text-dark": "var(--text-dark)",
        "text-light": "var(--text-light)", // Now .text-text-light will use var(--text-light)
        "text-background-default": "var(--text-background-default)", // Assuming --text-background-default is also in :root
      },
      borderRadius: {
        "rect-hover": "0.75rem",
      },
      transitionTimingFunction: {
        bouncy: "cubic-bezier(0.68, -0.6, 0.32, 1.6)",
      },
      fontFamily: {
        // <-- Add this section
        sans: [
          "Orbitron",
          "system-ui",
          "Avenir",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        orbitron: ["Orbitron", "sans-serif"], // Optional: if you want a specific font-orbitron utility
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".all-unset": {
          all: "unset",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
