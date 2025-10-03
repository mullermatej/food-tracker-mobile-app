import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { useLocalStorage } from "./useLocalStorage";

export const useNutritionData = () => {
  const [data, setData] = useState({});
  const { saveData, loadData } = useLocalStorage();
  // Track when initial storage has been loaded to avoid overwriting history
  const isLoadedRef = useRef(false);

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

  const updateTodayData = async (updates) => {
    const today = getTodayKey();
    // If initial load isn't done yet, merge with persisted storage to avoid wiping history
    let base = data;
    if (!isLoadedRef.current) {
      const stored = await loadData("nutritionData");
      if (stored && typeof stored === "object") {
        base = { ...stored, ...base };
      }
    }
    const prevToday = base[today] || {
      calories: 0,
      protein: 0,
      creatine: false,
      fishOil: false,
    };
    const nextData = {
      ...base,
      [today]: {
        ...prevToday,
        ...updates,
      },
    };
    setData(nextData);
    saveData("nutritionData", nextData);
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

  const updateDataForDate = async (date, updates) => {
    const dateKey = format(date, "yyyy-MM-dd");
    // If initial load isn't done yet, merge with persisted storage to avoid wiping history
    let base = data;
    if (!isLoadedRef.current) {
      const stored = await loadData("nutritionData");
      if (stored && typeof stored === "object") {
        base = { ...stored, ...base };
      }
    }
    const prev = base[dateKey] || {
      calories: 0,
      protein: 0,
      creatine: false,
      fishOil: false,
    };
    const nextData = {
      ...base,
      [dateKey]: {
        ...prev,
        ...updates,
      },
    };
    setData(nextData);
    saveData("nutritionData", nextData);
  };

  useEffect(() => {
    const loadInitialData = async () => {
      const stored = await loadData("nutritionData");
      if (stored && typeof stored === "object") {
        // Merge any optimistic updates done before load completed
        setData((prev) => ({ ...stored, ...prev }));
      }
      isLoadedRef.current = true;
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
