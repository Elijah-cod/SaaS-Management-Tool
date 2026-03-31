import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: ["./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                "dark-bg": "#101214",
                "dark-secondary": "#1d1f21",
                "stroke-dark": "#2d3135",
            },
        },
    },
    plugins: [],
};
export default config;