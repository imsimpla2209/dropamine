import {
  CalendarOutlined,
  HomeFilled,
  SafetyOutlined,
  TeamOutlined,
  UngroupOutlined,
  WeiboOutlined,
} from '@ant-design/icons'
import { Layout, MenuProps } from 'antd'
import { Content } from 'antd/es/layout/layout'
import React from 'react'
import useWindowSize from '../../../utils/useWindowSize'
import AppHeader from '../header'
import AppSidebar from '../sidebar'

type MenuItem = Required<MenuProps>['items'][number]

export function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem
}

const items: MenuProps['items'] = [
  getItem('Home', 'home', <HomeFilled />),
  { type: 'divider' },
  getItem(
    'PUBLIC',
    'grp',
    null,
    [
      getItem('Your Profile', 'account', <WeiboOutlined />),
      getItem('Users', 'accounts-manager', <TeamOutlined />),
      getItem('Departments', 'departments', <UngroupOutlined />),
      getItem('Events', 'event', <CalendarOutlined />),
      getItem('Backup data', 'backup', <SafetyOutlined />),
    ],
    'group'
  ),
]

const LayoutAdmin = ({ children }) => {
  const windowWidth = useWindowSize()
  const contentStyle =
    windowWidth > 1000
      ? {
          width: '100%',
          background: 'none',
        }
      : {
          maxWidth: 'none',
          width: '100%',
        }

  return (
    <>
      <AppHeader />
      <Layout
        style={{
          width: '100%',
          background: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          position: 'relative',
          height: '100%',
        }}
      >
        <AppSidebar items={items} />
        <Content style={contentStyle}>{children}</Content>
      </Layout>
    </>
  )
}

export default LayoutAdmin
