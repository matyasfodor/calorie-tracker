import { useState } from "react";
import { useCreateFoodEntry } from "../apollo/mutations";
import { useGetUserFoodEntries } from "../apollo/queries";
import { FoodEntriesTable, TableFilterState } from "../components/FoodEntriesTable";
import { CalorieCalendar } from "../components/CalorieCalendar";
import { EntryModal } from "../components/EntryModal";
import { Button } from "antd";


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


  if (!getEntries.data || getEntries.error) {
    return (<span>Error :( {getEntries.error?.message}</span>);
  }

  const footerRender = () =>
    <EntryModal
      title="Create food entry"
      okText="Create"
      loading={createFoodEntryState.loading}
      buttonRenderer={({ showModal }) => <Button onClick={showModal}>Add Entry</Button>}
      onSubmit={(entry) => { 
        // TODO allow assigning entries to any user
        createFoodEntry({ variables: { entry } });
      }}
    />

  return (
    <FoodEntriesTable
      dataSource={getEntries.data.self.entries.items}
      total={getEntries.data.self.entries.count}
      dataLoading={getEntries.loading}
      tableState={tableFilterState}
      onTableStateChange={handleTableStateChange}
      footerRenderer={footerRender}
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
