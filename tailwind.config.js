/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            keyframes: {
                aurora: {
                    "0%": {
                        backgroundPosition: "50% 50%, 50% 50%",
                    },
                    "50%": {
                        backgroundPosition: "150% 50%, 150% 50%",
                    },
                    "100%": {
                        backgroundPosition: "250% 50%, 250% 50%",
                    }
                },
                spotlight: {
                    "0%": {
                        opacity: 0,
                        transform: "translate(-72%, -62%) scale(0.5)",
                    },
                    "100%": {
                        opacity: 1,
                        transform: "translate(-50%, -40%) scale(1)",
                    }
                },
            },
            animation: {
                aurora: "aurora 15s linear infinite",
                spotlight: "spotlight 2s ease 0.75s 1 forwards",
            },
        },
    },
    plugins: [],
} 