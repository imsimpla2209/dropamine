import { CalendarOutlined, HomeFilled, RedditOutlined, WeiboOutlined } from '@ant-design/icons'
import { Layout, MenuProps } from 'antd'
import { Content } from 'antd/es/layout/layout'
import useWindowSize from '../../../utils/useWindowSize'
import { getItem } from '../admin'
import AppHeader from '../header'
import AppSidebar from '../sidebar'
import RightSideBar from './right-sidebar'

const items: MenuProps['items'] = [
  getItem('Home', 'home', <HomeFilled />),
  { type: 'divider' },
  getItem(
    'PUBLIC',
    'grp',
    null,
    [
      getItem('Your Profile', 'account', <WeiboOutlined />),
      getItem('Ideas', 'ideas', <RedditOutlined />),
      getItem('Events', 'event', <CalendarOutlined />),
    ],
    'group'
  ),
]

const LayoutStaff = ({ children }) => {
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
        <Content style={contentStyle}>
          <>{children}</>
        </Content>
        <RightSideBar />
      </Layout>
    </>
  )
}

export default LayoutStaff
