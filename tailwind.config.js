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
        "DarkGray": "#CFCFCF"
      },
      fontSize: {
        "xs": "0.8rem",
        "detail": "0.9rem",
        "body": "1.1rem",
        "heading3": "1.2rem",
        "heading2": "1.35rem",
        "heading": "1.625rem",
        "subTitle": "2rem",
        "title": "2.3rem",
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