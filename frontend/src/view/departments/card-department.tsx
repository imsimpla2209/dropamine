import { DeleteOutlined, EditOutlined, EyeTwoTone } from '@ant-design/icons'
import { Button, Card } from 'antd'
import Link from 'antd/es/typography/Link'
import useRoleNavigate from 'next/libs/use-role-navigate'

interface InterfaceDepartment {
  _id: string
  name: string
  users: any
}

function DepartmentCardItem({
  department,
  handleDeleteDepartment,
  setEditDepartment,
}: {
  department: InterfaceDepartment
  handleDeleteDepartment: any
  setEditDepartment: (department: any) => void
}) {
  const navigate = useRoleNavigate()

  const handleViewDepartmentDetails = (id: string) => {
    navigate(`/departments/${id}`)
  }

  return (
    <Card
      cover={
        <div
          className="center w-100 h-100"
          style={{
            display: 'flex',
            minHeight: '100px',
            borderRadius: '8px 8px 0px 0px',
            cursor: 'pointer',
            backgroundColor: '#343a40',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%239C92AC' fill-opacity='0.25' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"), linear-gradient(to right top, #343a40, #2b2c31, #211f22, #151314, #000000)`,
          }}
          onClick={() => handleViewDepartmentDetails(department._id)}
        >
          <Link
            style={{
              fontFamily: ` 'Share Tech', sans-serif`,
              fontSize: '38px',
              color: 'white',
              textShadow: `8px 8px 10px #0000008c`,
            }}
          >
            {department?.name}
          </Link>
        </div>
      }
      bordered={false}
      style={{ width: '100%', display: 'block' }}
      actions={[
        <Button type="text" icon={<EyeTwoTone />} onClick={() => handleViewDepartmentDetails(department._id)} />,
        <Button type="text" icon={<EditOutlined />} onClick={() => setEditDepartment(department)} />,
        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteDepartment(department._id)} />,
      ]}
      headStyle={{ borderBottom: '2px solid #d7d7d7' }}
      bodyStyle={{ display: 'none' }}
    />
  )
}

export default DepartmentCardItem
