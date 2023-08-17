import { Layout } from 'antd'
import React from 'react'
import useWindowSize from '../../../utils/useWindowSize'
import DepartmentCard from '../sidebar-card/department-card'
import EventCard from '../sidebar-card/events-card'

const RightSideBar: React.FC = () => {
  const windowSize = useWindowSize()

  return (
    <>
      {windowSize < 1000 ? (
        <></>
      ) : (
        <Layout.Sider
          width={278}
          style={{ background: 'transparent', boxSizing: 'border-box', paddingRight: '16px', marginTop: 16 }}
        >
          <EventCard />
          <DepartmentCard />
        </Layout.Sider>
      )}
    </>
  )
}

export default RightSideBar
