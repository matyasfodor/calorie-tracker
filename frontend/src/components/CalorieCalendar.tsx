import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useGetUserCaloriesByDay } from "../apollo/queries";
import Calendar from "../components/Calendar";


const CellRenderer = ({ date, caloriesByDay }: { date: dayjs.Dayjs; caloriesByDay: Record<string, number> }) => {
  const calendarDate = date.format('YYYY-MM-DD');
  const calories = (caloriesByDay[calendarDate]) || 0;
  const dayOfMonth = date.date();

  let color = '';
  if (calories === 0) {
    color = '#FFFFFF';
  } else if (calories < 2100) {
    color = '#00FF00';
  } else {
    color = '#FF0000';
  }

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: color }}>
      {dayOfMonth}
    </div>
  )
};

export const CalorieCalendar = () => {
  const [caloriesByDay, setCaloriesByDay] = useState<Record<string, number>>({});


  const [currentMonth, setCurrentMonth] = useState<{ from: dayjs.Dayjs, to: dayjs.Dayjs }>({
    from: dayjs().startOf('month'),
    to: dayjs().endOf('month'),
  });



  const getUserCaloriesByDay = useGetUserCaloriesByDay(currentMonth);

  useEffect(() => {
    if (getUserCaloriesByDay.data) {

      const caloriesByDay: Record<string, number> = getUserCaloriesByDay.data.self.caloriesPerDay.reduce((acc, { calories, date }) => {
        acc[date] = calories;
        return acc;
      }, {} as Record<string, number>);

      setCaloriesByDay(caloriesByDay);
    }
  }, [getUserCaloriesByDay.data]);

  const onCalendarChange = (date: dayjs.Dayjs) => {
    setCurrentMonth({
      from: date.utc(true).startOf('month'),
      to: date.utc(true).endOf('month'),
    });
  };

  return (
    <div style={{ width: 300 }}>
      <Calendar
        fullscreen={false}
        dateFullCellRender={(date: dayjs.Dayjs) =>
          <CellRenderer date={date} caloriesByDay={caloriesByDay} />}
        onPanelChange={onCalendarChange}
      />
    </div>
  )
}