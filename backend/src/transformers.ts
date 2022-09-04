import { Entry } from "@prisma/client";
import dayjs from "dayjs";
import { CaloriesPerDay } from "./types";

export const aggregateCaloriesPerDay = ({entries, userTimeZone = 'GMT'}: {entries: Entry[], userTimeZone?: string }) => {
  const caloriesByDay: Record<string, number> = entries.reduce((acc, entry: Entry) => {
    // TODO test if the aggregation works
    // Get user's timezone or default to GMT
    const date = dayjs(entry.timestamp).utc(true).local().tz(userTimeZone).format('YYYY-MM-DD');
    if (!entry.cheatMeal) {
      acc[date] = (acc[date] || 0) + entry.calorieValue;
    }
    return acc;
  }, {} as Record<string, number>);

  const aggregatedEntries: CaloriesPerDay = Object.entries(caloriesByDay).map(([date, calories]) => ({
    date,
    calories,
  }))

  return aggregatedEntries;
}