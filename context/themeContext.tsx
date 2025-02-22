import React, { createContext, useContext, useState, useEffect } from "react";
import { Appearance, useColorScheme } from "react-native";

export const colors = {
  light: {
    text: "#000000",
    subText: "#626262",
    nonFocus: "#b8c2d2",
    white: "#ffffff",
    gray: "#e8e8e8",
    background: "#fbffff",
    darkGray: "#CFCFCF",
    primary: "#1c60de",
    red: "#f43168",
    green: "#0dc47c",
    yellow: "#fba742",
    night: "#454ab6",
  },
  dark: {
    text: "#ffffff",
    subText: "#B1B1B1",
    nonFocus: "#4A4E56",
    white: "#18181A",
    gray: "#252525",
    background: "#101010",
    darkGray: "#303032",
    primary: "#1c60de",
    red: "#f43168",
    green: "#0dc47c",
    yellow: "#fba742",
    night: "#454ab6",
  },
} as const;

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextProps {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  colors: typeof colors.light | typeof colors.dark;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemTheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeMode>("system");

  // ฟังก์ชันเลือกธีมให้ถูกต้อง
  const getColors = () => {
    if (theme === "system") {
      return systemTheme === "dark" ? colors.dark : colors.light;
    }
    return colors[theme];
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors: getColors() }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};