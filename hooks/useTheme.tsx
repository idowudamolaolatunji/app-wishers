import { DarkTheme, LightTheme } from "@/constants/theme";
import { useThemeContext } from "@/contexts/ThemeContext";

export const useTheme = function() {
    const { currentTheme } = useThemeContext();
    
    const Colors = currentTheme === "dark" ? DarkTheme : LightTheme;
    
    return { Colors, currentTheme };
};