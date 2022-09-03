import dayjs from "dayjs";
import { useGetEntryCount } from "../apollo/queries";

export const AdminReportScreen = () => {
  const getEntryCountPastWeek = useGetEntryCount({
    from: dayjs().subtract(7, 'days').startOf('day'),
    to:dayjs().endOf('day'),
  });

  const getEntryCountPreviousWeek = useGetEntryCount({
    from: dayjs().subtract(14, 'days').startOf('day'),
    to: dayjs().subtract(7, 'days').endOf('day'),
  });
  
  return (<div>
    <h2>Admin report</h2>
    <p>Food Entries added in the last 7 days: ({getEntryCountPastWeek.data?.entries?.count})</p>
    <p>Food Entries added in the 7 days before: ({getEntryCountPreviousWeek.data?.entries?.count})</p>

  </div>)
}