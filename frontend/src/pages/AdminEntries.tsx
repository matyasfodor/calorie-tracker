import { Button, Modal, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { FoodEntry, FoodEntryWithoutId } from "../common/types";
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { EntryModal } from "../components/EntryModal";
import { useCreateFoodEntry, useDeleteFoodEntry, useUpdateFoodEntry } from "../apollo/mutations";
import { useGetAllEntries } from "../apollo/queries";
import { CheatMealRenderer } from "../components/CheatMealCheckbox";
import { FoodEntriesTable, TableFilterState } from "../components/FoodEntriesTable";
import { useState } from "react";

type ActionButtonsProps = {
  text: string, record: FoodEntry, index: number
}

const ActionButtons = (props: ActionButtonsProps) => {
  const [updateFoodEntry, updateFoodEntryState] = useUpdateFoodEntry();
  const [deleteFoodEntry] = useDeleteFoodEntry();

  const confirm = () => {
    Modal.confirm({
      title: 'Deleting food Entry',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete "${props.record.name}"?`,
      onOk: async () => {
        await deleteFoodEntry({ variables: { entryId: props.record.id } });
      }
    });
  };

  return (
    <div>
      <EntryModal
        title="Edit food entry"
        okText="Save"
        loading={updateFoodEntryState.loading}
        buttonRenderer={({ showModal }) => <Button icon={<EditOutlined />} onClick={showModal} />}
        onSubmit={async (entry: FoodEntryWithoutId) => { await updateFoodEntry({ variables: { entry, entryId: props.record.id } }) }}
        entry={props.record}
      />
      <Button icon={<DeleteOutlined />} onClick={confirm} />
    </div>);
}

const extraColumns: ColumnsType<FoodEntry | {}> = [{
  title: 'Owner',
  dataIndex: ['owner', 'name'],
  key: 'owner'
}, {
  title: 'Actions',
  key: 'actions',
  render: (text, record, index) => {
    return (<ActionButtons text={text} record={record as FoodEntry} index={index} />)
  }
}
];

export const AdminEntries = () => {
  const [tableFilterState, setTableFilterState] = useState<TableFilterState>({ limit: 10 });

  // TODO refetch can probably be used to refetch data as needed.
  const { loading, error, data } = useGetAllEntries({
    from: tableFilterState.from,
    to: tableFilterState.to,
    limit: tableFilterState.limit,
    offset: tableFilterState.offset,
  });

  const handleTableStateChange = (state: TableFilterState) => setTableFilterState(state);

  const [createFoodEntry, createFoodEntryState] = useCreateFoodEntry();

  const footerRender = () =>
    <EntryModal
      title="Create food entry"
      okText="Create"
      allowOwner
      loading={createFoodEntryState.loading}
      buttonRenderer={({ showModal }) => <Button onClick={showModal}>Add Entry</Button>}
      onSubmit={(entry) => {
        const {ownerId, ...entryWithoutOwner} = entry;
        createFoodEntry({ variables: { entry: entryWithoutOwner, ownerId } });
      }}
    />

  return <FoodEntriesTable
    dataSource={data?.entries.items ?? []}
    total={data?.entries.count ?? 0}
    dataLoading={loading}
    tableState={tableFilterState}
    onTableStateChange={handleTableStateChange}
    extraColumns={extraColumns}
    footerRenderer={footerRender}
  />
}
