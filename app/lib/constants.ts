import dayjs from "dayjs";

export const currentWeek = `${dayjs()
  .startOf("week")
  .format("MMM D")} - ${dayjs().endOf("week").format("MMM D, YYYY")}`;
export const startDayWeek = dayjs().startOf("week");
export const endDayWeek = dayjs().endOf("week");
