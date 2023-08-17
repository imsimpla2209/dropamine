import { Button, Card, Empty, List, Typography } from 'antd'
import { Http } from 'next/api/http'
import useRoleNavigate from 'next/libs/use-role-navigate'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import IdeaCard from './idea-card'

const { Title } = Typography

export default function CategoryDetails() {
  const { id } = useParams()
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useRoleNavigate()
  const [category, setCategory] = useState(null)

  const getCategoryDetails = async () => {
    await Http.get(`/api/v1/category?id=${id}`)
      .then(res => {
        setCategory(res.data?.data[0] || null)
      })
      .catch(error => enqueueSnackbar(error.message, { variant: 'error' }))
  }

  useEffect(() => {
    getCategoryDetails()
  }, [id])

  const navigateIdeaForm = (id: string) => {
    navigate(`/submit?category=${id}`)
  }
  return (
    <Card
      title={
        <Title style={{ margin: 0, fontSize: 24, textOverflow: 'ellipsis' }}>Name category: {category?.name}</Title>
      }
      style={{ borderRadius: 0, height: '100%', marginRight: 16 }}
      headStyle={{ backgroundColor: '#1677ff6d', borderRadius: 0 }}
    >
      <Title style={{ margin: '20px 0px 16px', fontSize: 18, color: '#1677ff' }}>Ideas in this category:</Title>

      {category?.ideas?.length ? (
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: page => {},
            pageSize: 5,
          }}
          style={{
            marginBottom: '50px',
          }}
          dataSource={category?.ideas}
          renderItem={(ideaId, index) => <IdeaCard index={index} key={index} ideaId={ideaId} />}
        />
      ) : (
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{ height: 60 }}
          description={<span>There is no any idea yet</span>}
          style={{ width: '100%', padding: 20 }}
        >
          <Button type="primary" onClick={() => navigateIdeaForm(category._id)}>
            Create Now
          </Button>
        </Empty>
      )}
    </Card>
  )
}
