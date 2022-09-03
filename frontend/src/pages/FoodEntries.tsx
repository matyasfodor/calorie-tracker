import { Button, Spin, Table } from "antd";
import type { ColumnsType } from "antd/lib/table/interface";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useCreateFoodEntry } from "../apollo/mutations";
import { useGetUserFoodEntries } from "../apollo/queries";
import { FoodEntry } from "../common/types";
import Calendar from "../components/Calendar";
import { EntryModal } from "../components/EntryModal";

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
}

export const FoodEntries = () => {
  const getEntries = useGetUserFoodEntries();
  const [createFoodEntry, createFoodEntryState] = useCreateFoodEntry();

  const [caloriesByDay, setCaloriesByDay] = useState<Record<string, number>>({});

  useEffect(() => {
    if (getEntries.data) {
      const caloriesByDay: Record<string, number> = getEntries.data.self.entries.reduce((acc, entry: FoodEntry) => {
        const date = dayjs(entry.timestamp).format('YYYY-MM-DD');
        acc[date] = (acc[date] || 0) + entry.calorieValue;
        return acc;
      }, {} as Record<string, number>);
      setCaloriesByDay(caloriesByDay);
    }

  }, [getEntries.data]);

  if (getEntries.loading) {
    return (<Spin />)
  }

  if (!getEntries.data || getEntries.error) {
    return (<span>Error :( {getEntries.error?.message}</span>);
  }

  return (
    <div>
      <div style={{ width: 300 }}>
        <Calendar fullscreen={false} dateFullCellRender={(date: dayjs.Dayjs) =>
          <CellRenderer date={date} caloriesByDay={caloriesByDay} />
        } />
      </div>
      <Table dataSource={getEntries.data.self.entries} columns={columns} footer={() => 
        <EntryModal
          title="Create food entry"
          okText="Create"
          loading={createFoodEntryState.loading}
          buttonRenderer={({showModal}) => <Button onClick={showModal}>Add Entry</Button>}
          onSubmit={(entry) => {createFoodEntry({variables: {entry}})}}
          />} />;
    </div>);
}
