import { UsergroupAddOutlined } from '@ant-design/icons'
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

function DepartmentCard() {
  const [departments, setDepartment] = useState<any>([])
  const navigate = useRoleNavigate()
  useEffect(() => {
    const fetchEvents = async () => {
      await Http.get('/api/v1/department/')
        .then(res => setDepartment(res.data.data))
        .catch(err => console.log(err, 'error to fetch department'))
    }
    fetchEvents()
  }, [])

  const onClickDepartmentItem: MenuProps['onClick'] = e => {
    navigate(`/departments/${e.key}`)
  }

  const items: MenuProps['items'] = [
    getItem('Department', 'menu', <UsergroupAddOutlined />, [
      ...departments.slice(0, 3).map(department => getItem(department.name, department._id)),
      getItem(
        'More Department',
        'sub-menu',
        null,
        departments.slice(3).map(department => getItem(department.name, department._id))
      ),
    ]),
  ]
  return (
    <Menu
      onClick={onClickDepartmentItem}
      style={{ width: 256 }}
      defaultSelectedKeys={['']}
      defaultOpenKeys={['menu']}
      mode="inline"
      items={items}
    />
  )
}

export default DepartmentCard
