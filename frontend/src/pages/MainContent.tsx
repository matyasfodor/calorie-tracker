import { Alert } from 'antd'
import isNil from 'lodash.isnil'
import { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Panel } from '../components/Panel'
import { RequireAdmin } from '../components/RequireAdmin'
import { AuthContext, AuthContextType } from '../contexts/AuthContext'
import { AdminEntries } from './AdminEntries'
import { AdminReportScreen } from './AdminReportScreen'
import { UserCalorieCalendar } from './UserCalorieCalendar'
import { UserFoodEntries } from './UserFoodEntries'

const LoginHelperRedirect = () => {
  const { user } = useContext(AuthContext) as AuthContextType
  if (isNil(user)) {
    return (
      <Panel>
        <Alert message='Please select a user in the top right corner' type='warning' />
      </Panel>
    )
  }
  return <Navigate to='/food-entries' replace />
}

export const MainContent = () => (
  <Routes>
    <Route path='/' element={<LoginHelperRedirect />} />
    <Route path='/food-entries' element={<UserFoodEntries />} />
    <Route path='/food-calendar' element={<UserCalorieCalendar />} />
    <Route
      path='admin-entries'
      element={
        <RequireAdmin>
          <AdminEntries />
        </RequireAdmin>
      }
    />
    <Route
      path='admin-report'
      element={
        <RequireAdmin>
          <AdminReportScreen />
        </RequireAdmin>
      }
    />
  </Routes>
)
