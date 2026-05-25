import React, { createContext, useContext, useState } from "react";

export const AVATAR_PRESETS = [
  { id: "indigo", color: "#4f46e5", label: "Indigo" },
  { id: "violet", color: "#7c3aed", label: "Violet" },
  { id: "rose", color: "#e11d48", label: "Rose" },
  { id: "cyan", color: "#0891b2", label: "Cyan" },
  { id: "emerald", color: "#059669", label: "Emerald" },
  { id: "amber", color: "#d97706", label: "Amber" },
  { id: "pink", color: "#db2777", label: "Pink" },
  { id: "slate", color: "#334155", label: "Slate" },
];

export const AVATAR_SHAPES = [
  { id: "circle", label: "Circle", radius: "50%" },
  { id: "rounded", label: "Rounded", radius: "20px" },
  { id: "square", label: "Square", radius: "4px" },
  { id: "blob", label: "Blob", radius: "42% 58% 62% 38% / 44% 40% 60% 56%" },
];

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [navColor, setNavColor] = useState(
    () => localStorage.getItem("ft_navColor") || "#4f46e5",
  );
  const [avatarShape, setAvatarShape] = useState(
    () => localStorage.getItem("ft_avatarShape") || "circle",
  );

  const updateNavColor = (color) => {
    setNavColor(color);
    localStorage.setItem("ft_navColor", color);
  };

  const updateAvatarShape = (shape) => {
    setAvatarShape(shape);
    localStorage.setItem("ft_avatarShape", shape);
  };

  return (
    <ThemeContext.Provider
      value={{
        navColor,
        setNavColor: updateNavColor,
        avatarShape,
        setAvatarShape: updateAvatarShape,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
