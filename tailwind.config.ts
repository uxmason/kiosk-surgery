// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    plugins: [],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                gray: {
                    50: "hsla(0, 0%, 98%, 1)",
                    100: "hsla(0, 0%, 96%, 1)",
                    200: "hsla(0, 0%, 93%, 1)",
                    300: "hsla(0, 0%, 88%, 1)",
                    400: "hsla(0, 0%, 74%, 1)",
                    500: "hsla(0, 0%, 62%, 1)",
                    600: "hsla(0, 0%, 46%, 1)",
                    700: "hsla(0, 0%, 38%, 1)",
                    800: "hsla(0, 0%, 26%, 1)",
                    900: "hsla(0, 0%, 13%, 1)",
                },
            },
        },
    },
};

export default config;
