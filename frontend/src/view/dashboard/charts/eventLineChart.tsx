import {Card, message, Skeleton, Typography} from 'antd';
import Title from 'antd/es/typography/Title';
import { Http } from 'next/api/http';
import React, {PureComponent, useEffect, useState} from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';


const CustomTooltip = props => {
  const { active, payload, label } = props

  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <Typography.Text type="secondary" style={{ display: 'block' }}>
          Week: {payload[0]?.payload?.weekNumber}
        </Typography.Text>
        <Typography.Text type="secondary" style={{ display: 'block' }}>
          Number of Ideas: {payload[0]?.payload['Total Idea']}
        </Typography.Text>
      </div>
    )
  }

  return null
}

export default function EventLineChart() {
  const [allWeekData, setAllWeekData] = useState([])
  const [loading, setLoading] = useState(true)
  const getAllWeek = async () => {
    await Http.get('/api/v1/idea/ideaTotalByDuration')
      .then(res => {
        console.log(res.data)
        setAllWeekData(res.data.data.map(weekData => ({ weekNumber: weekData?._id?.weeK, 'Total Idea': weekData?.count })))
        setLoading(false)
      })
      .catch(err => message.error('Failed to get week list'))
  }
  useEffect(() => {
    setLoading(true)
    getAllWeek()
  }, [])
  return (
    <Skeleton loading={loading}>
      <ResponsiveContainer width="100%" height="100%">
      <Card bordered={false}>
        <Title level={3}
          style={
            {margin: '5px'}
        }>
          Ideas trend in a week
        </Title>
        <LineChart width={500}
          height={300}
          data={allWeekData.sort((a, b) => parseFloat(a.weekNumber) - parseFloat(b.weekNumber))}
          margin={
            {
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }
        }>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis label={{ value: 'Week', offset: 0 }} dataKey="weekNumber" />
          <YAxis label= {{ value: 'Ideas number', angle: -90 }}/>
          <Tooltip content = {<CustomTooltip/>}/>
          <Legend/>
          <Line type="monotone" dataKey="Total Idea" stroke="#8884d8"
            activeDot={
              {r: 8}
            }/>
        </LineChart>
      </Card>
    </ResponsiveContainer>
    </Skeleton>
  );
}

