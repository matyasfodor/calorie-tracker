import { gql, useMutation, useQuery } from "@apollo/client";
import { Button, Checkbox, Form, Input, InputNumber, Modal, Spin, Table } from "antd";
import type { ColumnsType } from "antd/lib/table/interface";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Calendar from "../components/Calendar";
import DatePicker from "../components/DatePicker";
import TimePicker from "../components/TimePicker";

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


const CREATE_FOOD_ENTRY = gql`
  mutation CreateEntry($entry: CreateOrUpdateEntry!) {
    createEntry(entry: $entry) {
      name
      id
      calorieValue
      timestamp
    }
  }
`

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

type FormData = {
  calorieValue: number;
  cheatMeal: boolean
  name: string;
  timestampDate: dayjs.Dayjs;
  timestampTime: dayjs.Dayjs;
}

const TableFooter = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [createFoodEntry, { data, loading, error }] = useMutation(CREATE_FOOD_ENTRY);

  const showModal = () => {
    setIsModalVisible(true);
  }

  const handleOk = async () => {
    try {
      const {
        timestampDate,
        timestampTime,
        ...restValues
      }: FormData = await form.validateFields();
      const timestamp = dayjs(new Date(
        timestampDate.year(), timestampDate.month(), timestampDate.date(),
        timestampTime.hour(), timestampTime.minute(), timestampTime.second()
        // @ts-ignore
      )).utc('z').format();
      const foodEntry = {
        timestamp,
        ...restValues,
      };
      await createFoodEntry({variables: {entry: foodEntry}});
      form.resetFields();
      setIsModalVisible(false);
    } catch (err) {
      console.error(err)
    }
  }

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  }

  return (
    <>
      <Button onClick={showModal}>Add Entry</Button>

      <Modal
        title="Create food entry"
        visible={isModalVisible}
        okText="Create"
        onOk={handleOk}
        okButtonProps={{ disabled: loading }}
        onCancel={handleCancel}
      >
        <Form
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 12 }}
          form={form}
        >
          <Form.Item
            label="Date"
            name="timestampDate"
            rules={[{ required: true, message: 'Please select the date the meal was eaten' }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Time"
            name="timestampTime"
            rules={[{ required: true, message: 'Please select the time the meal was eaten' }]}
          >
            <TimePicker />
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please provide the name of your meal' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Calories"
            name="calorieValue"
            rules={[{ required: true, message: 'Please provide the number of calories' }]}
          >
            {/* TODO numeric input */}
            <InputNumber min={0} controls={false} />
          </Form.Item>
          <Form.Item
            label="Cheat meal"
            name="cheatMeal"
            valuePropName="checked"
          >
            <Checkbox />
          </Form.Item>
        </Form>
      </Modal>
    </>
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
      <div style={{ width: 300 }}>
        <Calendar fullscreen={false} dateFullCellRender={(date: dayjs.Dayjs) =>
          <CellRenderer date={date} caloriesByDay={caloriesByDay} />
        } />
      </div>
      <Table dataSource={data.self.entries} columns={columns} footer={() => <TableFooter />} />;
    </div>);
}
