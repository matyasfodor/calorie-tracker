import { gql, useMutation, useQuery } from "@apollo/client";
import { Button, Modal, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { FoodEntry, FoodEntryWithoutId } from "../common/types";
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { EntryModal } from "../components/EntryModal";
import { useDeleteFoodEntry, useUpdateFoodEntry } from "../apollo/mutations";

const GET_ALL_ENTRIES = gql`
  query getAllEntries {
    entries {
      items {
        name
        id
        calorieValue
        timestamp
        cheatMeal
        owner {
          name
        }
      }
    }
  }
`;

type GetAllEntriesResponse = {
  entries: {
    items: FoodEntry[];
  }
}

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
        await deleteFoodEntry({variables: {entryId: props.record.id}});
      }
    });
  };

  return (
    <div>
      <EntryModal
        title="Edit food entry"
        okText="Save"
        loading={updateFoodEntryState.loading}
        buttonRenderer={({showModal}) => <Button icon={<EditOutlined/>} onClick={showModal}/>}
        onSubmit={async (entry: FoodEntryWithoutId) => {await updateFoodEntry({variables: {entry, entryId: props.record.id}})}}
        entry={props.record}
      />
      <Button icon={<DeleteOutlined/>} onClick={confirm}/>
    </div>);
}

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
}, {
  title: 'Owner',
  dataIndex: ['owner', 'name'],
  key: 'owner'
}, {
  title: 'Actions',
  key: 'actions',
  render: (text, record, index) => {
    return (<ActionButtons text={text} record={record as FoodEntry} index={index}/>)
  }
}
];

export const AdminEntries = () => {
  // TODO refetch can probably be used to refetch data as needed.
  const { loading, error, data } = useQuery<GetAllEntriesResponse>(GET_ALL_ENTRIES);

  return (<Table dataSource={data?.entries.items} columns={columns} />);
}
