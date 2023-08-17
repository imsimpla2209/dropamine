import { Card, message, Skeleton, Typography } from 'antd'
import Title from 'antd/es/typography/Title'
import { Http } from 'next/api/http'
import { useEffect, useState } from 'react'
import { Bar, CartesianGrid, ComposedChart, Legend, Line, Tooltip, XAxis, YAxis } from 'recharts'

const { Text } = Typography

const CustomTooltip = props => {
  const { active, payload } = props

  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p
          className="label"
          style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {payload[0].payload.name}
        </p>

        <Text type="secondary" style={{ display: 'block' }}>
          Views: {payload[0].payload.views}
        </Text>
        <Text type="secondary" style={{ display: 'block' }}>
          Like: {payload[0].payload.like}
        </Text>
        <Text type="secondary" style={{ display: 'block' }}>
          Dislike: {payload[0].payload.dislike}
        </Text>
      </div>
    )
  }

  return null
}

function MostViewedIdeasChart() {
  const [ideasList, setIdeasList] = useState([])
  const [loading, setLoading] = useState(true)

  const getMostViewedIdeas = async () => {
    await Http.get('/api/v1/idea', { tab: 'hot' })
      .then(res => {
        setIdeasList(res.data.data)
        setLoading(false)
      })
      .catch(err => message.error('Failed to get most viewed ideas!'))
  }
  useEffect(() => {
    setLoading(true)
    getMostViewedIdeas()
  }, [])

  const formattedIdeas = ideasList?.map(idea => {
    return {
      name: idea.title?.toString(),
      like: idea.likes.length,
      dislike: idea.dislikes.length,
      views: Number(idea.meta.views),
    }
  })

  return (
    <Skeleton avatar title={false} loading={loading} active>
      <Card bordered={false} style={{ height: '100%' }}>
        <Title level={3} style={{ margin: '5px' }}>
          Top ideas with the most views
        </Title>
        <ComposedChart
          width={500}
          height={300}
          data={formattedIdeas}
          margin={{
            top: 30,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="name" label={{ value: 'Pages', position: 'insideBottomRight', offset: 0 }} scale="band" />
          <YAxis label={{ value: 'Views number', angle: -90, position: 'insideLeft' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="dislike" fill="#8884d8" stroke="#8884d8" />
          <Bar dataKey="views" barSize={20} fill="#413ea0" />
          <Line type="monotone" dataKey="like" stroke="#ff7300" />
        </ComposedChart>
      </Card>
    </Skeleton>
  )
}

export default MostViewedIdeasChart
