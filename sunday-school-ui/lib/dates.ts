export const getWeekStart = (d = new Date()) => {
  const dd = new Date(d);
  const day = dd.getDay();
  dd.setHours(0,0,0,0);
  dd.setDate(dd.getDate() - day);
  return dd;
};
export const toISO = (d: Date) => d.toISOString().slice(0,10);