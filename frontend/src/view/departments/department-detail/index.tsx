import { Card, Col, Empty, List, Row, Skeleton, Typography } from 'antd'
import { Http } from 'next/api/http'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import UserCard from './user-card'
const { Title } = Typography

export default function DepartmentDetail() {
  const { id } = useParams()
  const { enqueueSnackbar } = useSnackbar()
  const [department, setDepartment] = useState(null)
  const [loading, setLoading] = useState(false)

  const getDepartmentDetail = async () => {
    setLoading(true)
    await Http.get(`/api/v1/department?id=${id}`)
      .then(res => {
        setDepartment(res.data?.data[0] || null)
      })
      .catch(error => enqueueSnackbar(error.message, { variant: 'error' }))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getDepartmentDetail()
  }, [id])

  return (
    <Card
      title={<Title style={{ margin: 0, fontSize: 24, textOverflow: 'ellipsis' }}>{department?.name}</Title>}
      style={{ borderRadius: 0, height: '100%', marginRight: 16 }}
      headStyle={{ backgroundColor: '#1677ff6d', borderRadius: 0 }}
    >
      <Title style={{ margin: '20px 0px', fontSize: 18, color: '#1677ff' }}>Members in this department:</Title>

      {department?.users?.length ? (
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            pageSize: 5,
          }}
          style={{
            marginBottom: '50px',
          }}
          dataSource={department?.users}
          renderItem={(userId, index) => (
            <Col className="gutter-row"  key={index}>
              <Skeleton loading={loading}>
                <UserCard userId={userId} />
              </Skeleton>
            </Col>
          )}
        />
      ) : (
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{ height: 60 }}
          description={<span>There is no any member yet</span>}
          style={{ width: '100%', padding: 20 }}
        ></Empty>
      )}
    </Card>
  )
}
