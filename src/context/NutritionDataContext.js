import React, { createContext, useContext } from "react";
import { useNutritionData } from "../hooks/useNutritionData";

const NutritionDataContext = createContext(null);

export const NutritionDataProvider = ({ children }) => {
  const nutritionData = useNutritionData();

  return (
    <NutritionDataContext.Provider value={nutritionData}>
      {children}
    </NutritionDataContext.Provider>
  );
};

export const useNutritionDataContext = () => {
  const context = useContext(NutritionDataContext);
  if (!context) {
    throw new Error(
      "useNutritionDataContext must be used within NutritionDataProvider"
    );
  }
  return context;
};
