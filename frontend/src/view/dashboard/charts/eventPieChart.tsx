import { Card, message, Skeleton } from 'antd'
import Title from 'antd/es/typography/Title'
import { Http } from 'next/api/http'
import { useSocket } from 'next/socket.io'
import { useEffect, useMemo, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

function CategoryClassifyPieChart() {
  const [allCategories, setAllCategories] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  const { appSocket } = useSocket()

  const getAllCategory = async () => {
    await Http.get('/api/v1/category')
      .then(res => {
        setAllCategories(res.data.data.map(category => ({ name: category.name, ideas: category.ideas })))
        setLoading(false)
      })
      .catch(err => message.error('Failed to get categories list'))
  }

  useEffect(() => {
    setLoading(true)
    getAllCategory()
  }, [])

  const updateCategoriesRealtime = data =>
    setAllCategories(data.allCategories.map(category => ({ name: category.name, ideas: category.ideas })))

  useEffect(() => {
    appSocket.on('total_idea', updateCategoriesRealtime)
    return () => {
      appSocket.off('total_idea', updateCategoriesRealtime)
    }
  }, [updateCategoriesRealtime])

  const renderActiveShape = props => {
    const RADIAN = Math.PI / 180
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
    const sin = Math.sin(-RADIAN * midAngle)
    const cos = Math.cos(-RADIAN * midAngle)
    const sx = cx + (outerRadius + 10) * cos
    const sy = cy + (outerRadius + 10) * sin
    const mx = cx + (outerRadius + 30) * cos
    const my = cy + (outerRadius + 30) * sin
    const ex = mx + (cos >= 0 ? 1 : -1) * 22
    const ey = my
    const textAnchor = cos >= 0 ? 'start' : 'end'

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value} idea(s)`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    )
  }

  const formattedData = useMemo(() => {
    if (allCategories.length) {
      const top5Data = allCategories
        .map(category => ({ name: category.name, value: category.ideas.length }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)

      const totalIdea = allCategories
        .map(category => ({ name: category.name, value: category.ideas.length }))
        .sort((a, b) => b.value - a.value)
        .slice(5)
      const restData = totalIdea.length
        ? {
            name: 'Others',
            value: totalIdea.flatMap(category => category.value).reduce((acc, cur) => acc + cur),
          }
        : {}
      return [...top5Data, restData]
    }
  }, [allCategories])

  return (
    <Skeleton loading={loading}>
      {allCategories.length ? (
        <ResponsiveContainer width="100%" height="100%">
          <Card bordered={false}>
            <Title level={3} style={{ margin: '5px' }}>
              Number ideas of each categories
            </Title>

            <PieChart width={500} height={500}>
              <Pie
                data={formattedData}
                cx="50%"
                cy="50%"
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                innerRadius={90}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
              >
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </Card>
        </ResponsiveContainer>
      ) : null}
    </Skeleton>
  )
}

export default CategoryClassifyPieChart
