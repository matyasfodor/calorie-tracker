import { Menu } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import { Header as AntHeader } from 'antd/lib/layout/layout';
import { UserOutlined, DownOutlined } from "@ant-design/icons";

import styled from 'styled-components';

const StyledAntHeader = styled(AntHeader)`
  padding-right: 0;
`;

const SyledMenu = styled(Menu)`
  max-width: 300px;
  margin-left: auto;
`;


export const Header = () => (<StyledAntHeader>
  <SyledMenu mode="horizontal" triggerSubMenuAction="click">
    <Menu.SubMenu
      title={
        <>
          <Avatar icon={<UserOutlined />} />
          <span>Username</span>
          <DownOutlined/>
        </>
      }
      >
      <Menu.Item>1</Menu.Item>
      <Menu.Item>2</Menu.Item>
    </Menu.SubMenu>
  </SyledMenu>
</StyledAntHeader>)