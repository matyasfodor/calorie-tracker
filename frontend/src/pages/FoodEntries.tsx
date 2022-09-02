import { gql, useQuery } from "@apollo/client";
import { Spin, Table } from "antd";
import type { ColumnsType } from "antd/lib/table/interface";

type FoodEntry = {
  id: number;
  name: string;
  calorieValue: number;
  cheatMeal: boolean;
  timestamp: unknown;
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

const columns: ColumnsType<FoodEntry|{}> = [{
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

export const FoodEntries = () => {
  const { loading, error, data } = useQuery<{ self: { entries: {}[] } }>(GET_USER_FOOD_ENTRIES);

  if (loading) {
    return (<Spin />)
  }

  if (!data || error) {
    return (<span>Error :( {error?.message}</span>);
  }

  console.dir(data);

  return (
    <div>
      <Table dataSource={data.self.entries} columns={columns} />;
    </div>);
}