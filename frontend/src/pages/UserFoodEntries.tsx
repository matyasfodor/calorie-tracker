import { useState } from "react";
import { useCreateFoodEntry } from "../apollo/mutations";
import { useGetUserFoodEntries } from "../apollo/queries";
import { FoodEntryWithoutId } from "../common/types";
import { FoodEntriesTable, TableFilterState } from "../components/FoodEntriesTable";
import { CalorieCalendar } from "../components/CalorieCalendar";


const UserFoodEntriesTable = () => {
  const [tableFilterState, setTableFilterState] = useState<TableFilterState>({limit: 10});

  const getEntries = useGetUserFoodEntries({
    from: tableFilterState.from,
    to: tableFilterState.to,
    limit: tableFilterState.limit,
    offset: tableFilterState.offset,
  });

  const handleTableStateChange = (state: TableFilterState) => setTableFilterState(state);

  const [createFoodEntry, createFoodEntryState] = useCreateFoodEntry();

  const handleCreateFoodEntry = (entry: FoodEntryWithoutId) => {
    createFoodEntry({ variables: { entry } });
  }

  if (!getEntries.data || getEntries.error) {
    return (<span>Error :( {getEntries.error?.message}</span>);
  }

  return (
    <FoodEntriesTable
      dataSource={getEntries.data.self.entries.items}
      total={getEntries.data.self.entries.count}
      dataLoading={getEntries.loading}
      tableState={tableFilterState}
      createLoading={createFoodEntryState.loading}
      onTableStateChange={handleTableStateChange}
      createFoodEntry={handleCreateFoodEntry}
    />
  )
}

export const UserFoodEntries = () => {


  return (
    <div>
      <CalorieCalendar />
      <UserFoodEntriesTable />
    </div>);
}
