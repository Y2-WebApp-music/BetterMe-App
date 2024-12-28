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
        "detail": "0.875rem",
        "body": "1rem",
        "heading2": "1.25rem",
        "heading": "1.625rem",
        "title": "2rem"
      },
      fontFamily: {
        notoThin: ["NotoSansThai_100Thin", "sans-serif"],
        notoExtraLight: ["NotoSansThai_200ExtraLight", "sans-serif"],
        notoLight: ["NotoSansThai_300Light", "sans-serif"],
        noto: ["NotoSansThai_400Regular", "sans-serif"],
        notoMedium: ["NotoSansThai_500Medium", "sans-serif"],
        notoSemiBold: ["NotoSansThai_600SemiBold", "sans-serif"],
        notoBold: ["NotoSansThai_700Bold", "sans-serif"],
        notoExtraBold: ["NotoSansThai_800ExtraBold", "sans-serif"],
        notoBlack: ["NotoSansThai_900Black", "sans-serif"],
      },
      borderRadius: {
        "normal": "12px",
      }
    },
  },
  plugins: [],
}