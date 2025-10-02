import React from "react";
import { SymbolView } from "expo-symbols";

// Lightweight wrapper around Expo Symbols with a cross-platform fallback.
// Usage:
// <AppSymbol name="gearshape" size={16} color={theme.textSecondary} fallback={<Text>⚙️</Text>} />
export const AppSymbol = ({
  name,
  size = 16,
  color,
  weight,
  scale,
  type,
  fallback,
}) => {
  return (
    <SymbolView
      name={name}
      size={size}
      tintColor={color}
      weight={weight}
      scale={scale}
      type={type}
      // On Android/Web, this will be rendered instead of the SF Symbol
      fallback={fallback}
      // Keep layout flexible; parent should size container (e.g., 32x32 touch area)
      style={{ width: size, height: size }}
    />
  );
};

export default AppSymbol;
