import AntMenu from 'antd/lib/menu'
import { MenuItemType } from 'antd/lib/menu/hooks/useItems'
import isNil from 'lodash.isnil'
import { useContext } from 'react'
import { Link, matchRoutes, useLocation } from 'react-router-dom'
import { AuthContext, AuthContextType } from '../contexts/AuthContext'

function getItem (component: React.ReactNode, key: React.Key): MenuItemType {
  return {
    label: component,
    key
  }
}

const getRoutes = (loggedIn: boolean, isAdmin: boolean) => {
  const userRoutes = [
    { path: '/food-entries', title: 'My Food Entries' },
    { path: '/food-calendar', title: 'My Calorie Calendar' }
  ]
  const adminRoutes = [
    { path: '/admin-entries', title: '[Admin] Food Entries' },
    { path: '/admin-report', title: '[Admin] Report' }
  ]

  return [
    ...(loggedIn ? userRoutes : []),
    ...(isAdmin ? adminRoutes : [])
  ]
}

export const Menu = () => {
  const { user } = useContext(AuthContext) as AuthContextType

  const routes = getRoutes(!isNil(user), user?.isAdmin ?? false)

  const items = routes.map(({ path, title }) => getItem(<Link to={path}>{title}</Link>, path))

  const useCurrentPath = () => {
    const location = useLocation()
    const match = matchRoutes(routes, location)

    return match?.[0].pathnameBase ?? ''
  }

  const currentPath = useCurrentPath()

  return <AntMenu theme='dark' selectedKeys={[currentPath]} mode='inline' items={items} activeKey={currentPath} />
}
