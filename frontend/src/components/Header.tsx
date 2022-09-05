import { Menu } from 'antd'
import { ItemType } from 'antd/lib/menu/hooks/useItems'
import Avatar from 'antd/lib/avatar/avatar'
import { Header as AntHeader } from 'antd/lib/layout/layout'
import { UserOutlined, DownOutlined } from '@ant-design/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAppleWhole } from '@fortawesome/free-solid-svg-icons'

import styled from 'styled-components'

import { AuthContext, AuthContextType } from '../contexts/AuthContext'
import { useContext } from 'react'
import { useGetUsers } from '../apollo/queries'
import { User } from '../common/types'

const StyledAntHeader = styled(AntHeader)`
  padding-right: 0;
  display: flex;
  flex-direction: horizontal;
  font-weight: bold;
`

const SyledMenu = styled(Menu)`
  width: 230px;
  margin-left: auto;
`

const SpacedText = styled.span`
  margin-left: 1rem; ;
`

const PageTitle = styled.div`
  color: white;
  display: inline-block;
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
    label: user.name
  }))

  return (
    <StyledAntHeader>
      <PageTitle>
        <FontAwesomeIcon icon={faAppleWhole} size={'2x'} />
        <SpacedText>Calorie Tracker</SpacedText>
      </PageTitle>
      <SyledMenu
        theme='dark'
        mode='horizontal'
        triggerSubMenuAction='click'
        items={[
          {
            key: 'submenu',
            label: (
              <>
                <DownOutlined />
                <Avatar icon={<UserOutlined />} />
                <SpacedText>{user?.name ?? 'Select User!'}</SpacedText>
              </>
            ),
            children
          }
        ]}
      />
    </StyledAntHeader>
  )
}
