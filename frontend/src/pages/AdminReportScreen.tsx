import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import dayjs from "dayjs";
import { useGetAllUserCaloriesByDay, useGetEntryCount } from "../apollo/queries";

// TODO extract into it's own function
const columns: ColumnsType<{ id: string, name: string, caloriesPerDay: { calories: number, date: string }[] }> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Calories last week',
    key: 'calories',
    render: (text, record, index) => {
      return record.caloriesPerDay.reduce((prev, {calories}) => prev + calories, 0);
    }
  }
]

export const AdminReportScreen = () => {
  const getEntryCountPastWeek = useGetEntryCount({
    from: dayjs().subtract(7, 'days').startOf('day'),
    to:dayjs().endOf('day'),
  });

  const getEntryCountPreviousWeek = useGetEntryCount({
    from: dayjs().subtract(14, 'days').startOf('day'),
    to: dayjs().subtract(7, 'days').endOf('day'),
  });

  const getAllUserCaloriesByDay = useGetAllUserCaloriesByDay({
    from: dayjs().subtract(7, 'days').startOf('day'),
    to:dayjs().endOf('day'),
  });

  return (<div>
    <h2>Admin report</h2>
    <p>Food Entries added in the last 7 days: ({getEntryCountPastWeek.data?.entries?.count})</p>
    <p>Food Entries added in the 7 days before: ({getEntryCountPreviousWeek.data?.entries?.count})</p>
    <Table columns={columns} dataSource={getAllUserCaloriesByDay.data?.users}/>
  </div>)
}