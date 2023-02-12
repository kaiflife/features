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

import {
  addMinutes, format, formatDistanceStrict, setDefaultOptions,
} from 'date-fns';
import { ru } from 'date-fns/locale';

setDefaultOptions({ locale: ru });

export const getTimeZoneDate = (date, useTimezone) => (
  useTimezone
    ? addMinutes(new Date(date), new Date(date).getTimezoneOffset())
    : new Date(date)
);

export const SERVER_DATE_MASK = 'yyyy-MM-dd HH:mm:ss';
export const HOURS_MINUTES_SECONDS_DATE_MASK = 'HH:mm:ss';

export const formatDate = ({ date, mask = 'dd-MM-yyyy', useTimezone }) => date
  && format(getTimeZoneDate(date, useTimezone), mask);

export const formatToServerDate = (date) => formatDate({ date, mask: SERVER_DATE_MASK });

export const getDayMonthYear = (date, useTimezone) => date
  && format(getTimeZoneDate(date, useTimezone), 'dd.MM.yyyy');

export const getDayMonthName = (date, useTimezone) => date
  && format(getTimeZoneDate(date, useTimezone), 'dd MMMM');

export const getHourMinute = (date, useTimezone) => date
  && format(getTimeZoneDate(date, useTimezone), 'HH:mm');

export const getDayMonthNameYear = (date, useTimezone) => date
  && format(getTimeZoneDate(date, useTimezone), 'dd MMMM yyyy');

export const getDayMonthNameYearTime = (date, useTimezone) => date
  && format(getTimeZoneDate(date, useTimezone), 'dd MMMM yyyy, HH:mm');

export const getDistanceDate = (fromDate, toDate) => formatDistanceStrict(
  new Date(fromDate),
  toDate ? new Date(toDate) : new Date(),
);
