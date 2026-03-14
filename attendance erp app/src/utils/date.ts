import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const formatDate = (date: string | Date) => {
  const d = dayjs(date);
  return d.isValid() ? d.format("DD MMM YYYY") : "TBD";
};

export const formatTime = (time: string) => {
  const t = dayjs(time, "HH:mm");
  return t.isValid() ? t.format("hh:mm A") : "--:--";
};

export const formatDateTime = (date: string, start: string, end?: string) => {
  if (!date) return "TBD";
  const base = `${formatDate(date)}${start ? ` · ${formatTime(start)}` : ""}`;
  return end ? `${base} - ${formatTime(end)}` : base;
};

export const getToday = () => dayjs().format("YYYY-MM-DD");
export const getCurrentWeekday = () => dayjs().format("dddd");
