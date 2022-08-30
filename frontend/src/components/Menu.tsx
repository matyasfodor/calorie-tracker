import AntMenu from 'antd/lib/menu';
import { MenuItemType } from 'antd/lib/menu/hooks/useItems';
import MenuItem from 'antd/lib/menu/MenuItem';

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItemType {
  // @ts-ignore
  return {
    key,
    icon,
    children,
    label,
  } as MenuItemType;
}

const items = [
  getItem('Option 1', '1', <div>Yolololo</div>),
  getItem('Option 2', '2', <div>Yaay</div>),
];

export const Menu = () => (
  <AntMenu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
)