import { AppstoreOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import { Http } from 'next/api/http'
import useRoleNavigate from 'next/libs/use-role-navigate'
import React, { useEffect, useState } from 'react'

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

function EventCard() {
  const [events, setEvents] = useState<any>([])
  const navigate = useRoleNavigate()
  useEffect(() => {
    const fetchEvents = async () => {
      await Http.get('/api/v1/event/')
        .then(res => setEvents(res.data.data))
        .catch(err => console.log(err, 'error to fetch events'))
    }
    fetchEvents()
  }, [])

  const onClickEventItem: MenuProps['onClick'] = e => {
    navigate(`/event/${e.key}`)
  }

  const items: MenuProps['items'] = [
    getItem('Special Events Going On', 'menu', <AppstoreOutlined />, [
      ...events.slice(0, 3).map(event => getItem(event.title, event._id)),
      getItem(
        'More Event',
        'sub-menu',
        null,
        events.slice(3).map(event => getItem(event.title, event._id))
      ),
    ]),
  ]
  return (
    <Menu
      onClick={onClickEventItem}
      style={{ width: 256 }}
      defaultSelectedKeys={['']}
      defaultOpenKeys={['menu']}
      mode="inline"
      items={items}
    />
  )
}

export default EventCard
