import type {Config} from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Poppins", "sans-serif"],
                display: ["Poppins", "sans-serif"],
                poppins: "Poppins"
            },
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                backgreen: "var(--backgreen)",
            },
            gridTemplateRows: {
              '21': 'repeat(21, minmax(0, 1fr))',
            }
        },
    },
    plugins: [],
};

export default config;
