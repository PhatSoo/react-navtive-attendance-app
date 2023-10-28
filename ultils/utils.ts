export const getDateOfFirstDayOfNextMonth = (date: Date) => {
  const nextMonth = date.getMonth() + 2;
  const daysInMonth = new Date(date.getFullYear(), nextMonth).getDate();
  return new Date(date.getFullYear(), nextMonth, daysInMonth);
};
