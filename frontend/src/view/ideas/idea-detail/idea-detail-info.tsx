import { CompassOutlined, EyeOutlined, LinkedinOutlined, TagsTwoTone, UserOutlined } from '@ant-design/icons'
import { Avatar, Space, Tag, Typography } from 'antd'
import { formatDayTime } from 'next/utils/helperFuncs'
const { Text } = Typography

export default function IdeaDetailInfo({ item }) {
  console.log(item)
  return (
    <>
      <Space direction="horizontal">
        {!item?.isAnonymous && item?.publisherId?.name ? (
          <Avatar style={{ margin: '0px' }} size={45} src={item?.publisherId?.avatar} />
        ) : (
          <Avatar style={{ margin: '0px' }} size={45} icon={<UserOutlined />} />
        )}
        <Space direction="vertical" size={[0, 0]}>
          <span>
            <Text strong> {!item?.isAnonymous ? item?.publisherId?.name ?? 'Account deleted' : 'Anonymous'}</Text>
            <Text type="secondary" style={{ marginLeft: 10 }}>
              Posted {formatDayTime(item?.createdAt ? item?.createdAt : Date.now())}
            </Text>
          </span>
          <Space direction="horizontal">
            <Text type="secondary" keyboard style={{ opacity: 0.7 }}>
              <EyeOutlined /> {item?.meta?.views} views
            </Text>
            <Typography.Text type="secondary">
              <Tag icon={<LinkedinOutlined />} color="#007E80">
                {/* 373B44 004853 */}
                <strong>
                  {item?.publisherId?.department?.name ? item?.publisherId?.department?.name : 'No department'}
                </strong>
              </Tag>
              <Tag icon={<CompassOutlined />} color="#FA6900">
                <strong>{item?.specialEvent?.title ? item?.specialEvent?.title : 'No Event'}</strong>
              </Tag>
            </Typography.Text>
          </Space>
        </Space>
      </Space>

      <Typography.Title level={3} style={{ margin: '5px 0' }}>
        {item?.title}
      </Typography.Title>

      <Space size={[0, 8]} wrap>
        <TagsTwoTone style={{ padding: '5px' }} />
        {item?.categories.length !== 0 ? (
          item?.categories.map(tag => (
            <Tag key={tag.name} color="geekblue">
              {tag.name}
            </Tag>
          ))
        ) : (
          <Tag>No Tag</Tag>
        )}
      </Space>
    </>
  )
}
