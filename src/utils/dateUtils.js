import { format } from "date-fns";

export const formatDate = (date, formatString = "EEEE, MMM d") => {
  return format(date, formatString);
};

export const getTodayKey = () => {
  return format(new Date(), "yyyy-MM-dd");
};

export const formatDateKey = (date) => {
  return format(date, "yyyy-MM-dd");
};
