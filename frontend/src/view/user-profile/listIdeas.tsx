import { Button, Divider, List, message } from 'antd'
import { Http } from 'next/api/http'
import { useEffect, useState } from 'react'
import IdeaCard from '../ideas/idea-card'

export default function ListIdeas({ userId }) {
  const [myIdea, setMyIdea] = useState([])
  const [loadmore, setLoadmore] = useState(0)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    const getMyIdea = async () => {
      await Http.get('/api/v1/idea')
        .then(res => {
          setMyIdea(res.data.data.filter(idea => idea.likes.includes(userId)))
          setLoadmore(res.data.data.filter(idea => idea.likes.includes(userId)).length)
        })
        .catch(err => message.error('Fail to get idea list'))
        .finally(() => setLoading(false))
    }
    getMyIdea()
  }, [])

  const loadMoreButton =
    myIdea?.length < loadmore ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button onClick={() => setLoadmore(Number(loadmore + 5))} loading={loading}>
          Loading more
        </Button>
      </div>
    ) : myIdea?.length ? (
      <Divider plain>It is all, nothing more 🤐</Divider>
    ) : null

  return (
    <List
      loading={loading}
      loadMore={loadMoreButton}
      itemLayout="vertical"
      size="large"
      dataSource={myIdea.slice(0, loadmore)}
      renderItem={idea => <IdeaCard key={`${idea}`} idea={idea} isLoading={loading}></IdeaCard>}
    />
  )
}
