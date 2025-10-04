import { useLocalStorage } from "./useLocalStorage";
import { format } from "date-fns";

/**
 * Hook for managing food/nutrition history log
 * Entries are grouped by date (yyyy-MM-dd) and stored in AsyncStorage
 *
 * Entry structure:
 * {
 *   id: string (timestamp),
 *   type: 'calories' | 'protein' | 'favourite',
 *   timestamp: ISO string,
 *   data: {
 *     calories?: number,
 *     protein?: number,
 *     foodName?: string (for favourites)
 *   }
 * }
 */
export const useHistoryLog = () => {
  const { saveData, loadData } = useLocalStorage();
  const HISTORY_KEY = "nutritionHistory";

  /**
   * Add a new entry to history log
   * @param {string} type - 'calories' | 'protein' | 'favourite'
   * @param {object} data - Entry data (calories, protein, foodName)
   */
  const addEntry = async (type, data) => {
    try {
      const now = new Date();
      const dateKey = format(now, "yyyy-MM-dd");
      const timestamp = now.toISOString();

      const newEntry = {
        id: timestamp,
        type,
        timestamp,
        data,
      };

      // Load existing history
      const history = (await loadData(HISTORY_KEY)) || {};

      // Add entry to today's array (or create new array)
      if (!history[dateKey]) {
        history[dateKey] = [];
      }
      history[dateKey].push(newEntry);

      // Save back to storage
      await saveData(HISTORY_KEY, history);
    } catch (error) {
      console.error("Failed to add history entry:", error);
    }
  };

  /**
   * Get all history entries, grouped by date
   * @returns {object} History object keyed by date (yyyy-MM-dd)
   */
  const getHistory = async () => {
    try {
      const history = await loadData(HISTORY_KEY);
      return history || {};
    } catch (error) {
      console.error("Failed to load history:", error);
      return {};
    }
  };

  /**
   * Get entries for a specific date
   * @param {Date} date - Date to get entries for
   * @returns {array} Array of entries for that date
   */
  const getEntriesForDate = async (date) => {
    try {
      const dateKey = format(date, "yyyy-MM-dd");
      const history = await loadData(HISTORY_KEY);
      return history?.[dateKey] || [];
    } catch (error) {
      console.error("Failed to load entries for date:", error);
      return [];
    }
  };

  /**
   * Clear all history
   */
  const clearHistory = async () => {
    try {
      await saveData(HISTORY_KEY, {});
    } catch (error) {
      console.error("Failed to clear history:", error);
    }
  };

  return {
    addEntry,
    getHistory,
    getEntriesForDate,
    clearHistory,
  };
};
