import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 18px 60px rgba(28, 31, 54, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
