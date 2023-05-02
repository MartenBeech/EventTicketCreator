export const convertUTCToYearMonthDate = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const dayString = day.toString().padStart(2, "0");
  const monthString = month.toString().padStart(2, "0");
  const yearString = year.toString();

  return `${dayString}/${monthString}/${yearString}`;
};

export const convertUTCToHourMinute = (date: Date) => {
  const hour = date.getHours();
  const minute = date.getMinutes();

  const hourString = hour.toString().padStart(2, "0");
  const minuteString = minute.toString().padStart(2, "0");

  return `${hourString}:${minuteString}`;
};

export const convertYearMonthDateToUTC = (dateString: string) => {
  let date = new Date();
  if (dateString) {
    const [dayString, monthString, yearString] = dateString.split("/");
    date.setDate(parseInt(dayString));
    date.setMonth(parseInt(monthString) - 1);
    date.setFullYear(parseInt(yearString));
  }
  return date;
};

export const convertHourMinuteToUTC = (timeString: string) => {
  let date = new Date();
  if (timeString) {
    const [hourString, minuteString] = timeString.split(":");
    date.setHours(parseInt(hourString));
    date.setMinutes(parseInt(minuteString));
  } else {
    date.setHours(0);
    date.setMinutes(0);
  }
  return date;
};
