import { ArrowLeftOutlined, ClockCircleTwoTone, FireTwoTone, RocketTwoTone } from '@ant-design/icons'
import { Alert, Button, Card, Empty, List, Row, Space, Typography } from 'antd'
import { Http } from 'next/api/http'
import { BlueColorButton } from 'next/components/custom-style-elements/button'
import useRoleNavigate from 'next/libs/use-role-navigate'
import { useSnackbar } from 'notistack'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import IdeaCard from './idea-card'

const { Title } = Typography

export default function EventDetails({ role }: { role?: string }) {
  const { id } = useParams()
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useRoleNavigate()
  const [event, setEvent] = useState(null)
  const isEventClosed = useMemo(() => new Date(event?.firstCloseDate) < new Date(), [event])
  const getEventDetails = async () => {
    await Http.get(`/api/v1/event?id=${id}`)
      .then(res => {
        setEvent(res.data?.data[0] || null)
      })
      .catch(error => enqueueSnackbar(error.message, { variant: 'error' }))
  }

  useEffect(() => {
    getEventDetails()
  }, [id])

  const navigateIdeaForm = (id: string) => {
    navigate(`/submit?event=${id}`)
  }
  return (
    <Card
      title={
        <Space align="center" size="large">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/event')} />
          <Title style={{ margin: 0, fontSize: 24, textOverflow: 'ellipsis' }}>{event?.title}</Title>
        </Space>
      }
      style={{ borderRadius: 0, height: '100%', marginRight: 16 }}
      headStyle={{ borderRadius: 0 }}
    >
      <Title style={{ margin: '0px 0px 16px', fontSize: 18, color: '#1677ff' }}>About this event:</Title>
      {isEventClosed && (
        <Alert
          style={{ marginBottom: 16 }}
          type="error"
          description={'This event is closed, you cannot add a new idea to it.'}
        />
      )}

      <Alert
        type="success"
        description={
          <>
            <div>
              <Space style={{ color: '#0055d5' }}>
                <ClockCircleTwoTone twoToneColor="#0055d5" />
                <p style={{ margin: 8 }}>Start date: {new Date(event?.startDate).toLocaleString('en-US')}</p>
              </Space>
            </div>
            <div>
              <Space style={{ color: '#d59900' }}>
                <FireTwoTone twoToneColor="#d59900" />
                <p style={{ margin: 8 }}>
                  First closure date: {new Date(event?.firstCloseDate).toLocaleString('en-US')}
                </p>
              </Space>
            </div>
            <div>
              <Space style={{ color: '#d52e00' }}>
                <RocketTwoTone twoToneColor="#d52e00" />
                <p style={{ margin: 8 }}>
                  Final closure date: {new Date(event?.finalCloseDate).toLocaleString('en-US')}
                </p>
              </Space>
            </div>
          </>
        }
      />

      <Title style={{ margin: '20px 0px 16px', fontSize: 18, color: '#1677ff' }}>Description:</Title>
      <Alert type="info" description={<div dangerouslySetInnerHTML={{ __html: event?.description }} />} />

      <Row style={{ alignItems: 'center', justifyContent: 'space-between', margin: '20px 0px 16px' }}>
        <Title style={{ margin: 0, fontSize: 18, color: '#1677ff' }}>Ideas in this event:</Title>
        {role === 'staff' && event?.ideas?.length && !isEventClosed ? (
          <BlueColorButton onClick={() => navigateIdeaForm(event._id)}>Add new idea</BlueColorButton>
        ) : null}
      </Row>
      {event?.ideas?.length ? (
        <List
          itemLayout="vertical"
          size="large"
          style={{
            marginBottom: '50px',
          }}
          dataSource={event?.ideas}
          renderItem={(ideaId, index) => <IdeaCard index={index} key={index} ideaId={ideaId} />}
        />
      ) : (
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{ height: 60 }}
          description={<span>There is no any idea yet</span>}
          style={{ width: '100%', padding: 20 }}
        >
          {role === 'staff' && !isEventClosed ? (
            <BlueColorButton onClick={() => navigateIdeaForm(event._id)}>Create Now</BlueColorButton>
          ) : null}
        </Empty>
      )}
    </Card>
  )
}
