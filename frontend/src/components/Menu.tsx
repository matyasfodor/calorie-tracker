import AntMenu from 'antd/lib/menu';
import { MenuItemType } from 'antd/lib/menu/hooks/useItems';
import { Link, matchRoutes, useLocation } from 'react-router-dom';

function getItem(
  component: React.ReactNode,
  key: React.Key,
): MenuItemType {
  return {
    label: component,
    key,
  };
}

const routes = [
  {path: "/invoices", title: "Invoices"},
  {path: "/expenses", title: "Expenses"},
]

export const Menu = () => {
  const items = routes.map(({path, title}) => getItem(<Link to={path}>{title}</Link>, path),)

  const useCurrentPath = () => {
    const location = useLocation()
    const match = matchRoutes(routes, location)
  
    return match?.[0].pathnameBase ?? ''
  }

  const currentPath = useCurrentPath();

  return (
    <AntMenu theme="dark" defaultSelectedKeys={[currentPath]} mode="inline" items={items} activeKey={currentPath}/>
  )
}



