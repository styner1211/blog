export function getDateStringWithDiff(days) {
  let date = new Date();
  date.setDate(date.getDate() + days);
  date = date.toISOString().split("T")[0].slice(0, 10);
  return date;
}
