import { Checkbox, Form, Input, InputNumber, Modal } from 'antd'
import dayjs from 'dayjs'
import { ReactNode, useState } from 'react'
import { FoodEntry, FoodEntryWithoutId } from '../common/types'

import DatePicker from '../components/DatePicker'
import TimePicker from '../components/TimePicker'

interface FormData {
  calorieValue: number
  cheatMeal: boolean
  name: string
  timestampDate: dayjs.Dayjs
  timestampTime: dayjs.Dayjs
}

interface EntryModalProps {
  title: string
  entry?: FoodEntry
  okText: string
  allowOwner?: boolean
  loading?: boolean
  buttonRenderer: ({ showModal }: { showModal: () => void }) => ReactNode
  onSubmit: (data: FoodEntryWithoutId) => void | Promise<void>
  onCancel?: () => void
}

export const EntryModal = (props: EntryModalProps) => {
  const [form] = Form.useForm()
  // Chance to prepopulate
  // form.setFields([{name: 'asdasname', value: 'asdas'}]);
  let initialValues
  if (props.entry != null) {
    // form.setFields([{name: 'asdasname', value: 'asdas'}]);
    // Object.entries(props.entry)
    const { timestamp, ...restEntry } = props.entry
    initialValues = {
      ...restEntry,
      timestampDate: dayjs(timestamp),
      timestampTime: dayjs(timestamp)
    }
  } else {
    initialValues = {
      timestampDate: dayjs(),
      timestampTime: dayjs()
    }
  }
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = async () => {
    try {
      const { timestampDate, timestampTime, ...restValues }: FormData = await form.validateFields()
      const timestamp = dayjs(
        new Date(
          timestampDate.year(),
          timestampDate.month(),
          timestampDate.date(),
          timestampTime.hour(),
          timestampTime.minute(),
          timestampTime.second()
        )
      )
        .utc(true)
        .format()
      const foodEntry = {
        timestamp,
        ...restValues
      }
      await props.onSubmit(foodEntry)
      form.resetFields()
      setIsModalVisible(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setIsModalVisible(false)
  }

  return (
    <>
      {props.buttonRenderer({ showModal })}

      <Modal
        title={props.title}
        visible={isModalVisible}
        okText={props.okText}
        onOk={() => {
          void handleOk()
        }}
        okButtonProps={{ disabled: props.loading }}
        onCancel={handleCancel}
      >
        <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} form={form} initialValues={initialValues}>
          <Form.Item label='Date' name='timestampDate' rules={[{ required: true, message: 'Please select the date the meal was eaten' }]}>
            <DatePicker />
          </Form.Item>
          <Form.Item label='Time' name='timestampTime' rules={[{ required: true, message: 'Please select the time the meal was eaten' }]}>
            <TimePicker />
          </Form.Item>
          <Form.Item label='Name' name='name' rules={[{ required: true, message: 'Please provide the name of your meal' }]}>
            <Input />
          </Form.Item>
          <Form.Item label='Calories' name='calorieValue' rules={[{ required: true, message: 'Please provide the number of calories' }]}>
            <InputNumber min={0} controls={false} />
          </Form.Item>
          <Form.Item label='Cheat meal' name='cheatMeal' valuePropName='checked'>
            <Checkbox />
          </Form.Item>
          {props?.allowOwner ?? false
            ? (
            <Form.Item label='Owner' name='ownerId' rules={[{ required: true, message: 'Please set the ownerId' }]}>
              <InputNumber min={0} controls={false} />
            </Form.Item>
              )
            : null}
        </Form>
      </Modal>
    </>
  )
}
