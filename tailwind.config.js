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
        "subText": "#626262",
        "nonFocus": "#b8c2d2",
        "white": "#ffffff",
        "red": "#f43168",
        "gray": "#e8e8e8",
        "Background": "#fbffff",
        "green": "#0dc47c",
        "yellow": "#fba742",
        "night": "#454ab6",
        "DarkGray": "#d9d9d9"
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
        notoThin: ["NotoSans_100Thin", "sans-serif"],
        notoExtraLight: ["NotoSans_200ExtraLight", "sans-serif"],
        notoLight: ["NotoSans_300Light", "sans-serif"],
        noto: ["NotoSans_400Regular", "sans-serif"],
        notoMedium: ["NotoSans_500Medium", "sans-serif"],
        notoSemiBold: ["NotoSans_600SemiBold", "sans-serif"],
        notoBold: ["NotoSans_700Bold", "sans-serif"],
        notoExtraBold: ["NotoSans_800ExtraBold", "sans-serif"],
        notoBlack: ["NotoSans_900Black", "sans-serif"],
      },
      borderRadius: {
        "normal": "12px",
      }
    },
  },
  plugins: [],
}