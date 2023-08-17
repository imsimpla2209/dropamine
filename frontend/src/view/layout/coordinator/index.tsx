import { CalendarOutlined, HomeFilled, LinkedinOutlined, UngroupOutlined, WeiboOutlined } from '@ant-design/icons'
import { Layout, MenuProps } from 'antd'
import { Content } from 'antd/es/layout/layout'
import React from 'react'
import useWindowSize from '../../../utils/useWindowSize'
import AppHeader from '../header'
import AppSidebar from '../sidebar'
import RightSideBar from '../staff/right-sidebar'
import { useSubscription } from 'next/libs/global-state-hook'
import { userStore } from 'next/view/auth/user-store'

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
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




const LayoutCoordinator = ({ children }) => {
  const { department } = useSubscription(userStore).state
  console.log(department)
  const items: MenuProps['items'] = [
    getItem('Home', 'home', <HomeFilled />),
    { type: 'divider' },
    getItem(
      'PUBLIC',
      'grp',
      null,
      [getItem('Your Profile', 'account', <WeiboOutlined />), getItem('Events', 'event', <CalendarOutlined />), getItem('Your Department', `departments/${department._id}`, <LinkedinOutlined />)],
      'group'
    ),
  ]
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
        }}
      >
        <AppSidebar items={items} />
        <Content style={contentStyle}>{<>{children}</>}</Content>
        <RightSideBar />
      </Layout>
    </>
  )
}

export default LayoutCoordinator
