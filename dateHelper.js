import { compareDesc, format } from "date-fns";

export const clearHours = (date) => {
  const newDate = getMoscowTime(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

export const formatDate = (date, formatString = "dd.MM.yy") => date && format(getMoscowTime(date), formatString);

export const getMoscowTime = (date = new Date()) => new Date(`${date} GMT+0300`);

export const compareDescendingDMY = (startDate, endDate) => {
  const resetStartDate = clearHours(startDate);
  const resetEndDate = clearHours(endDate);
  return compareDesc(resetStartDate, resetEndDate);
};