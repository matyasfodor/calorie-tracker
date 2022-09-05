import { Col, PageHeader, Row, Statistic, Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import dayjs from 'dayjs'
import { useGetAllUserCaloriesByDay, useGetEntryCount } from '../apollo/queries'
import { Panel } from '../components/Panel'

const columns: ColumnsType<{ id: string, name: string, entries: { sumCalories: number } }> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Calories last week',
    key: 'calories',
    align: 'right',
    dataIndex: ['entries', 'sumCalories'],
    render: (_, { entries: { sumCalories } }) => {
      return `${((sumCalories as number) / 7).toFixed(2)} cal`;
    }
  }
]

export const AdminReportScreen = () => {
  const getEntryCountPastWeek = useGetEntryCount({
    from: dayjs().subtract(7, 'days').startOf('day'),
    to: dayjs().endOf('day')
  })

  const getEntryCountPreviousWeek = useGetEntryCount({
    from: dayjs().subtract(14, 'days').startOf('day'),
    to: dayjs().subtract(7, 'days').endOf('day')
  })

  const getAllUserCaloriesByDay = useGetAllUserCaloriesByDay({
    from: dayjs().subtract(7, 'days').startOf('day'),
    to: dayjs().endOf('day')
  })

  return (
    <div>
      <PageHeader title='Admin report' />

      <Row>
        <Col>
          <Panel title='Overall statistics'>
            <Row gutter={20}>
              <Col span={14}>
                <Statistic title='Food Entries added in the last 7 days' value={getEntryCountPastWeek.data?.entries?.count} />
              </Col>
            </Row>
            <Row>
              <Col span={14}>
                <Statistic title='Food Entries added in the 7 days before' value={getEntryCountPreviousWeek.data?.entries?.count} />
              </Col>
            </Row>
          </Panel>
        </Col>
        <Col>
          <Panel title='Calories added per user' maxWidth={600}>
            <Table columns={columns} rowKey='id' dataSource={getAllUserCaloriesByDay.data?.users} />
          </Panel>
        </Col>
      </Row>
    </div>
  )
}
