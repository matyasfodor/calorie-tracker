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
    dataIndex: ['entries', 'sumCalories']
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
          <Panel title='Overall statistics' maxWidth={600}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic title='Food Entries added in the last 7 days' value={getEntryCountPastWeek.data?.entries?.count} />
              </Col>
              <Col span={12}>
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
