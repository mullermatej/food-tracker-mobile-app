import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { useLocalStorage } from "./useLocalStorage";

export const useNutritionData = () => {
  const [data, setData] = useState({});
  const { saveData, loadData } = useLocalStorage();
  // Track when initial storage has been loaded to avoid overwriting history
  const isLoadedRef = useRef(false);
  const [loaded, setLoaded] = useState(false);
  // Queue updates that happen before initial load completes
  const pendingUpdatesRef = useRef([]);

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
    // If initial load hasn't completed, optimistically update local state but queue the write to avoid overwriting history
    if (!isLoadedRef.current) {
      setData((prev) => {
        const prevToday = prev[today] || {
          calories: 0,
          protein: 0,
          creatine: false,
          fishOil: false,
        };
        return {
          ...prev,
          [today]: { ...prevToday, ...updates },
        };
      });
      pendingUpdatesRef.current.push({
        type: "date",
        date: new Date(),
        updates,
      });
      return;
    }

    // Loaded: merge with existing state and persist
    const base = data;
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
    // If initial load hasn't completed, optimistically update local state but queue the write to avoid overwriting history
    if (!isLoadedRef.current) {
      setData((prev) => {
        const prevEntry = prev[dateKey] || {
          calories: 0,
          protein: 0,
          creatine: false,
          fishOil: false,
        };
        return {
          ...prev,
          [dateKey]: { ...prevEntry, ...updates },
        };
      });
      pendingUpdatesRef.current.push({ type: "date", date, updates });
      return;
    }

    // Loaded: merge with existing state and persist
    const base = data;
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
      let combined = {};
      if (stored && typeof stored === "object") {
        combined = { ...stored };
      }
      // Apply any optimistic updates that happened before load
      if (pendingUpdatesRef.current.length > 0) {
        for (const item of pendingUpdatesRef.current) {
          const key = format(item.date, "yyyy-MM-dd");
          const prevEntry = combined[key] || {
            calories: 0,
            protein: 0,
            creatine: false,
            fishOil: false,
          };
          combined[key] = { ...prevEntry, ...item.updates };
        }
      }
      setData((prev) => ({ ...combined, ...prev }));
      // Persist once after applying queued updates to ensure history is saved
      await saveData("nutritionData", { ...combined, ...data });
      // Mark as loaded and clear queue
      pendingUpdatesRef.current = [];
      isLoadedRef.current = true;
      setLoaded(true);
    };
    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    getTodayData,
    updateTodayData,
    getDataForDate,
    updateDataForDate,
    loaded,
  };
};
