import {
  ClockCircleTwoTone,
  DeleteOutlined,
  EditOutlined,
  EyeTwoTone,
  FireTwoTone,
  RocketTwoTone,
} from '@ant-design/icons'
import { Button, Card, Space } from 'antd'
import Link from 'antd/es/typography/Link'
import useRoleNavigate from 'next/libs/use-role-navigate'

interface IEvent {
  _id: string
  title: string
  description: string
  startDate: string
  firstCloseDate: string
  finalCloseDate: string
  ideas: any
}

function EventCardItem({
  event,
  handleDeleteEvent,
  setEditEvent,
  role,
}: {
  event: IEvent
  handleDeleteEvent: any
  setEditEvent: (event: any) => void
  role?: string
}) {
  const navigate = useRoleNavigate()

  const handleViewEventDetails = (id: string) => {
    navigate(`/event/${id}`)
  }

  return (
    <Card
      title={
        <Link style={{ fontSize: '20px', fontWeight: 600 }} onClick={() => handleViewEventDetails(event._id)}>
          {event?.title}
        </Link>
      }
      bordered={false}
      style={{ width: '100%', display: 'block' }}
      extra={
        <Space wrap>
          <Button type="text" icon={<EyeTwoTone />} onClick={() => handleViewEventDetails(event._id)} />
          {role === 'admin' && <Button type="text" icon={<EditOutlined />} onClick={() => setEditEvent(event)} />}
          {role === 'admin' && (
            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteEvent(event._id)} />
          )}
        </Space>
      }
      headStyle={{ borderBottom: '2px solid #d7d7d7' }}
    >
      <div>
        <Space style={{ color: '#0055d5' }}>
          <ClockCircleTwoTone twoToneColor="#0055d5" />
          <p style={{ margin: 8 }}>Start date: {new Date(event.startDate).toLocaleString('en-US')}</p>
        </Space>
      </div>
      <div>
        <Space style={{ color: '#d59900' }}>
          <FireTwoTone twoToneColor="#d59900" />
          <p style={{ margin: 8 }}>First closure date: {new Date(event.firstCloseDate).toLocaleString('en-US')}</p>
        </Space>
      </div>

      <div>
        <Space style={{ color: '#d52e00' }}>
          <RocketTwoTone twoToneColor="#d52e00" />
          <p style={{ margin: 8 }}>Final closure date: {new Date(event.finalCloseDate).toLocaleString('en-US')}</p>
        </Space>
      </div>
    </Card>
  )
}

export default EventCardItem
