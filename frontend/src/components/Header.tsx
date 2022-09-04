import { Menu } from 'antd'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import Avatar from 'antd/lib/avatar/avatar'
import { Header as AntHeader } from 'antd/lib/layout/layout'
import { UserOutlined, DownOutlined } from '@ant-design/icons'

import styled from 'styled-components'

import { AuthContext, AuthContextType } from '../contexts/AuthContext'
import { useContext } from 'react'
import { useGetUsers } from '../apollo/queries'
import { User } from '../common/types'

const StyledAntHeader = styled(AntHeader)`
  padding-right: 0;
`

const SyledMenu = styled(Menu)`
  max-width: 300px;
  margin-left: auto;
`

export const Header = () => {
  const { loading, error, data } = useGetUsers()

  const { user, setUser } = useContext(AuthContext) as AuthContextType

  if (loading) return <p>Loading...</p>

  if (data == null || error != null) return <p>Error :(</p>

  const handleUserSelect = (user: User) => {
    setUser(user)
  }

  const children: ItemType[] = data.users.map((user) => ({
    key: user.id,
    onClick: () => handleUserSelect(user),
    label: user.name,
  }))

  return (
    <StyledAntHeader>
      <SyledMenu
        mode='horizontal'
        triggerSubMenuAction='click'
        items={[
          {
            key: 'submenu',
            label: (
              <>
                <Avatar icon={<UserOutlined />} />
                <span>{user?.name ?? 'Select User!'}</span>
                <DownOutlined />
              </>
            ),
            children,
          },
        ]}
      />
    </StyledAntHeader>
  )
}
