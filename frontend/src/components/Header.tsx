import { Menu } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import { Header as AntHeader } from 'antd/lib/layout/layout';
import { UserOutlined, DownOutlined } from "@ant-design/icons";

import styled from 'styled-components';

import { useQuery, gql } from '@apollo/client';
import { AuthContext, AuthContextType, User } from '../contexts/AuthContext';
import { useContext } from 'react';

const GET_USERS = gql`
  query getUsers {
    users {
      id
      name
      jwt
    }
  }
`;

const StyledAntHeader = styled(AntHeader)`
  padding-right: 0;
`;

const SyledMenu = styled(Menu)`
  max-width: 300px;
  margin-left: auto;
`;

export const Header = () => {
  const { loading, error, data } = useQuery<{users: User[]}>(GET_USERS);

  const {user, setUser} = useContext(AuthContext) as AuthContextType;

  if (loading) return <p>Loading...</p>;

  if (!data || error) return <p>Error :(</p>;

  const handleUserSelect = (user: User) => {
    setUser(user);
  }

  return (
    <StyledAntHeader>
      <SyledMenu mode="horizontal" triggerSubMenuAction="click">
        <Menu.SubMenu
          title={
            <>
              <Avatar icon={<UserOutlined />} />
              <span>{user?.name ?? 'Select User!'}</span>
              <DownOutlined />
            </>
          }
        >
          {
            data.users.map((user) => (
              <Menu.Item key={user.id} onClick={() => handleUserSelect(user)}>{user.name}</Menu.Item>
            ))
          }
        </Menu.SubMenu>
      </SyledMenu>
    </StyledAntHeader>);
}