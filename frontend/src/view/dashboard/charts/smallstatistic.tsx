import { Card, Col, message, Row } from 'antd'
import Title from 'antd/es/typography/Title'
import { Http } from 'next/api/http'
import { useSocket } from 'next/socket.io'
import React, { useEffect, useState } from 'react'

const SmallStatistic: React.FC = () => {
  const { appSocket } = useSocket()

  const [totalAccount, setTotalAccount] = useState(0)
  const [totalIdea, setTotalIdea] = useState(0)
  const [totalEvent, setTotalEvent] = useState(0)

  const getTotalAccount = async () => {
    await Http.get('/api/v1/users/totalAccount')
      .then(res => setTotalAccount(res.data?.total))
      .catch(err => message.error('Failed to get total accounts!'))
  }
  const getTotalIdea = async () => {
    await Http.get('/api/v1/idea/totalIdea')
      .then(res => setTotalIdea(res.data?.total))
      .catch(err => message.error('Failed to get total ideas!'))
  }

  const getEventList = async () => {
    await Http.get('/api/v1/event/available')
      .then(res => {
        setTotalEvent(res.data.data.length)
      })
      .catch(error => message.error('Failed to get total events!'))
  }
  getEventList()
  useEffect(() => {
    getTotalAccount()
    getTotalIdea()
  }, [])

  const updateTotalAccount = data => setTotalAccount(data?.total || 0)
  const updateTotalIdea = data => setTotalIdea(data?.total || 0)
  const updateTotalEventAvailable = data => setTotalEvent(data?.totalAvailable || 0)

  useEffect(() => {
    // App socket
    appSocket.on('total_account', updateTotalAccount)
    appSocket.on('total_idea', updateTotalIdea)
    appSocket.on('all_events', updateTotalEventAvailable)

    // The listeners must be removed in the cleanup step, in order to prevent multiple event registrations
    return () => {
      appSocket.off('total_account', updateTotalAccount)
      appSocket.off('total_idea', updateTotalIdea)
      appSocket.off('all_events', updateTotalEventAvailable)
    }
  }, [updateTotalAccount, updateTotalIdea, updateTotalEventAvailable])

  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={8} xxl={8} style={{ marginBottom: 10 }}>
        <Card bordered={false}>
          <Title level={3} style={{ margin: 0 }}>
            Total Accounts
          </Title>
          <Title level={4} type="success">
            {totalAccount?.toString()} accounts
          </Title>
        </Card>
      </Col>
      <Col xs={24} sm={24} md={8} xxl={8} style={{ marginBottom: 10 }}>
        <Card bordered={false}>
          <Title level={3} style={{ margin: 0 }}>
            Total Ideas
          </Title>
          <Title level={4} type="success">
            {totalIdea?.toString()} ideas
          </Title>
        </Card>
      </Col>
      <Col xs={24} sm={24} md={8} xxl={8} style={{ marginBottom: 10 }}>
        <Card bordered={false}>
          <Title level={3} style={{ margin: 0 }}>
            Total event incoming
          </Title>
          <Title level={4} type="success">
            {totalEvent?.toString()} events
          </Title>
        </Card>
      </Col>
    </Row>
  )
}

export default SmallStatistic
