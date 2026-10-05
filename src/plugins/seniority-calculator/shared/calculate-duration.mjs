'use strict';

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
export const MODES = new Set(['years', 'breakdown', 'totalDays', 'decimalYears']);

const parseDate = (value) => {
  if (typeof value !== 'string' && !(value instanceof Date)) {
    return null;
  }

  const dateString =
    value instanceof Date
      ? `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(
          value.getDate()
        ).padStart(2, '0')}`
      : value;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateString);

  if (!match) {
    return null;
  }

  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

  if (
    date.getUTCFullYear() !== Number(year) ||
    date.getUTCMonth() !== Number(month) - 1 ||
    date.getUTCDate() !== Number(day)
  ) {
    return null;
  }

  return date;
};

const daysInMonth = (year, month) =>
  new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

const addMonthsClamped = (date, months) => {
  const absoluteMonth = date.getUTCFullYear() * 12 + date.getUTCMonth() + months;
  const year = Math.floor(absoluteMonth / 12);
  const month = absoluteMonth % 12;
  const day = Math.min(date.getUTCDate(), daysInMonth(year, month));

  return new Date(Date.UTC(year, month, day));
};

export const calculateDuration = (dateValue, mode = 'years', referenceDate = new Date()) => {
  if (!MODES.has(mode)) {
    throw new Error(`Unsupported duration mode: ${mode}`);
  }

  const start = parseDate(dateValue);
  const end = parseDate(referenceDate);

  if (!start || !end || start > end) {
    return '';
  }

  const totalDays = Math.floor((end.getTime() - start.getTime()) / DAY_IN_MILLISECONDS);

  if (mode === 'totalDays') {
    return String(totalDays);
  }

  if (mode === 'decimalYears') {
    return (totalDays / 365.2425).toFixed(2);
  }

  let years = end.getUTCFullYear() - start.getUTCFullYear();
  let anniversary = addMonthsClamped(start, years * 12);

  if (anniversary > end) {
    years -= 1;
    anniversary = addMonthsClamped(start, years * 12);
  }

  let months = 0;

  while (months < 11) {
    const nextMonth = addMonthsClamped(anniversary, months + 1);

    if (nextMonth > end) {
      break;
    }

    months += 1;
  }

  const monthAnniversary = addMonthsClamped(anniversary, months);
  const days = Math.floor((end.getTime() - monthAnniversary.getTime()) / DAY_IN_MILLISECONDS);

  if (mode === 'years') {
    return String(years);
  }

  const yearLabel = years === 1 ? 'año' : 'años';
  const monthLabel = months === 1 ? 'mes' : 'meses';
  const dayLabel = days === 1 ? 'día' : 'días';

  return `${years} ${yearLabel}, ${months} ${monthLabel}, ${days} ${dayLabel}`;
};
