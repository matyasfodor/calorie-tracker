import { gql, useQuery } from "@apollo/client";
import { Spin, Table } from "antd";
import type { ColumnsType } from "antd/lib/table/interface";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Calendar from "../components/Calendar";

type FoodEntry = {
  id: number;
  name: string;
  calorieValue: number;
  cheatMeal: boolean;
  timestamp: string;
}

const GET_USER_FOOD_ENTRIES = gql`
  query getUserFoodEntries {
    self {
      entries {
        id
        name
        calorieValue
        cheatMeal
        timestamp
      }
    }
  }
`;

const columns: ColumnsType<FoodEntry | {}> = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name'
}, {
  title: 'Calorie Value',
  dataIndex: 'calorieValue',
  key: 'calorieValue'
}, {
  title: 'Is cheat meal',
  dataIndex: 'cheatMeal',
  key: 'cheatMeal'
}, {
  title: 'Date',
  dataIndex: 'timestamp',
  key: 'timestamp'
}
];

const CellRenderer = ({date, caloriesByDay}: {date: dayjs.Dayjs; caloriesByDay: Record<string, number>}) => {
  const calendarDate = date.format('YYYY-MM-DD');
  const calories = (caloriesByDay[calendarDate]) || 0;
  const dayOfMonth = date.date();

  let color = '';
  if (calories === 0) {
    color = '#FFFFFF';
  } else if (calories < 2100) {
    color = '#00FF00';
  } else {
    color = '#FF0000' ;
  }

  console.log(date, color);

  return (
    <div style={{width: '100%', height: '100%', backgroundColor: color}}>
      {dayOfMonth}
    </div>
  )
}



export const FoodEntries = () => {
  const { loading, error, data } = useQuery<{ self: { entries: FoodEntry[] } }>(GET_USER_FOOD_ENTRIES);
  const [caloriesByDay, setCaloriesByDay] = useState<Record<string, number>>({});

  useEffect(() => {
    if (data) {
      const caloriesByDay: Record<string, number> = data.self.entries.reduce((acc, entry: FoodEntry) => {
        const date = dayjs(entry.timestamp).format('YYYY-MM-DD');
        acc[date] = (acc[date] || 0) + entry.calorieValue;
        return acc;
      }, {} as Record<string, number>);
      setCaloriesByDay(caloriesByDay);
    }

  }, [data]);

  if (loading) {
    return (<Spin />)
  }

  if (!data || error) {
    return (<span>Error :( {error?.message}</span>);
  }

  return (
    <div>
      <div style={{width: 300}}>
        <Calendar fullscreen={false} dateFullCellRender={(date: dayjs.Dayjs) =>
           <CellRenderer date={date} caloriesByDay={caloriesByDay}/>
           } />
      </div>
      <Table dataSource={data.self.entries} columns={columns} />;
    </div>);
}
