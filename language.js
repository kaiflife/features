export const dayPronounce = (daysCount) => daysCount === 1 ? "День" : [2, 3, 4].includes(daysCount) ? "Дня" : "Дней";