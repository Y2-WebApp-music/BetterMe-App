/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "primary": "#1c60de",
        "text": "#000000",
        "sub-text": "#626262",
        "non-focus": "#b8c2d2",
        "white": "#ffffff",
        "red": "#f43168",
        "gray": "#e8e8e8",
        "Background": "#fbffff",
        "green": "#0dc47c",
        "yellow": "#fba742",
        "night": "#454ab6",
        "Dark-gray": "#d9d9d9"
      },
      fontSize: {
        "xs": "0.75rem",
        "sm": "0.875rem",
        "base": "1rem",
        "lg": "1.25rem",
        "xl": "1.625rem",
        "2xl": "2rem"
      },
      fontFamily: {
        "noto-sans": "Noto Sans"
      },
      borderRadius: {
        "rounded-0": "0rem",
        "rounded-1": "0.07291655987501144rem",
        "rounded-2": "0.15625rem",
        "rounded-3": "0.26875001192092896rem",
        "rounded-4": "0.3125rem",
        "rounded-5": "0.375rem",
        "rounded-6": "0.53125rem",
        "rounded-7": "0.75rem",
        "rounded-8": "0.78125rem",
        "rounded-9": "0.875rem",
        "rounded-10": "1.25rem",
        "rounded-11": "1.5rem",
        "rounded-12": "1.625rem",
        "rounded-13": "2rem",
        "rounded-14": "2.1875rem",
        "rounded-15": "2.5625rem",
        "rounded-16": "2.75rem",
        "rounded-17": "3rem",
        "rounded-18": "4rem",
        "rounded-19": "62.4375rem"
      }
    },
  },
  plugins: [],
}