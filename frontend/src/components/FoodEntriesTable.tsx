import Table, { ColumnsType } from 'antd/lib/table'
import dayjs from 'dayjs'
import { RangeValue } from 'rc-picker/lib/interface'
import { ReactNode } from 'react'
import { Tooltip } from 'antd'

import { FoodEntry } from '../common/types'
import { CheatMealRenderer } from './CheatMealCheckbox'
import DatePicker from './DatePicker'

export interface TableFilterState {
  from?: dayjs.Dayjs | null
  to?: dayjs.Dayjs | null
  limit?: number | null
  offset?: number | null
}

interface Props<T extends object> {
  dataSource: T[]
  total: number
  dataLoading: boolean
  tableState: TableFilterState
  onTableStateChange: (values: TableFilterState) => void
  extraColumns?: ColumnsType<T | {}>
  footerRenderer: () => ReactNode
}

const { RangePicker } = DatePicker

export const FoodEntriesTable = <T extends object>(props: Props<T>) => {
  const handleFilterChange = (value: RangeValue<dayjs.Dayjs>) => {
    const update: Partial<TableFilterState> = {
      from: value?.[0] ?? null,
      to: value?.[1] ?? null
    }
    props.onTableStateChange({
      ...props.tableState,
      ...update
    })
  }

  const columns: ColumnsType<T | {}> = [
    {
      title: 'Date',
      dataIndex: 'timestamp',
      key: 'timestamp',
      filterDropdown: () => (
        <div>
          <RangePicker value={[props.tableState.from ?? null, props.tableState.to ?? null]} onChange={handleFilterChange} />
        </div>
      ),
      render: (_, record) => {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

        const localeTime = dayjs((record as FoodEntry).timestamp).utc().tz(timezone)
        return (
          <Tooltip title={`${localeTime.format('YYYY-MM-DD HH:MM:ss')}`}>
            {localeTime.fromNow()}
          </Tooltip>
        )
      }
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Calorie Value',
      dataIndex: 'calorieValue',
      key: 'calorieValue',
      align: 'right',
      render: (_, record) => {
        return `${(record as FoodEntry).calorieValue.toFixed(2)} cal`
      }
    },
    {
      title: 'Is cheat meal',
      key: 'cheatMeal',
      render: (_, record) => {
        return <CheatMealRenderer entry={record as FoodEntry} />
      }
    },
    ...(props.extraColumns ?? [])
  ]

  const handlePaginationChange = (page: number, pageSize: number) => {
    props.onTableStateChange({
      ...props.tableState,
      limit: pageSize,
      offset: (page - 1) * pageSize
    })
  }

  return (
    <>
      <Table
        dataSource={props.dataSource}
        rowKey='id'
        loading={props.dataLoading}
        columns={columns}
        footer={props.footerRenderer}
        pagination={{
          current: ((props.tableState.offset ?? 0) / 10) + 1,
          total: props.total,
          onChange: handlePaginationChange
        }}
      />
    </>
  )
}
