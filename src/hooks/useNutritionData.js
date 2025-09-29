import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useLocalStorage } from "./useLocalStorage";

export const useNutritionData = () => {
  const [data, setData] = useState({});
  const { saveData, loadData } = useLocalStorage();

  const getTodayKey = () => format(new Date(), "yyyy-MM-dd");

  const getTodayData = () => {
    const today = getTodayKey();
    return (
      data[today] || {
        calories: 0,
        protein: 0,
        creatine: false,
        fishOil: false,
      }
    );
  };

  const updateTodayData = (updates) => {
    const today = getTodayKey();
    const newData = {
      ...data,
      [today]: {
        ...getTodayData(),
        ...updates,
      },
    };
    setData(newData);
    saveData("nutritionData", newData);
  };

  const getDataForDate = (date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return (
      data[dateKey] || {
        calories: 0,
        protein: 0,
        creatine: false,
        fishOil: false,
      }
    );
  };

  const updateDataForDate = (date, updates) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const prev = data[dateKey] || {
      calories: 0,
      protein: 0,
      creatine: false,
      fishOil: false,
    };
    const newData = {
      ...data,
      [dateKey]: {
        ...prev,
        ...updates,
      },
    };
    setData(newData);
    saveData("nutritionData", newData);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      const stored = await loadData("nutritionData");
      if (stored) {
        setData(stored);
      }
    };
    loadInitialData();
  }, []);

  return {
    data,
    getTodayData,
    updateTodayData,
    getDataForDate,
    updateDataForDate,
  };
};
