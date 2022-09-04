import { PageHeader } from 'antd'
import { CalorieCalendar } from '../components/CalorieCalendar'
import { Panel } from '../components/Panel'

export const UserCalorieCalendar = () => {
  return (
    <>
      <PageHeader title='My Calorie Calendar' />
      <Panel maxWidth={360}>
        <CalorieCalendar />
      </Panel>
    </>
  )
}
