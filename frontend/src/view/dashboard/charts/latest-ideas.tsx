import { DislikeOutlined, LikeOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, List, Skeleton, Tooltip } from 'antd'
import { Http } from 'next/api/http'
import useRoleNavigate from 'next/libs/use-role-navigate'
import { IconText } from 'next/view/events/event-details/idea-card'
import { useSnackbar } from 'notistack'
import React, { useEffect, useState } from 'react'

const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae']

const LatestIdeaList: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useRoleNavigate()
  const [initLoading, setInitLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ideaList, setIdeaList] = useState([])

  const getAllIdeas = async () =>
    await Http.get(`/api/v1/idea`)
      .then(res => setIdeaList(res.data.data))
      .catch(error => enqueueSnackbar('Failed to get all ideas !', { variant: 'error' }))
      .finally(() => setInitLoading(false))

  useEffect(() => {
    setInitLoading(true)
    getAllIdeas()
  }, [])

  const loadMore =
    !initLoading && !loading ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      ></div>
    ) : null

  return (
    <>
      <List
        itemLayout="vertical"
        size="large"
        loading={initLoading}
        loadMore={loadMore}
        dataSource={ideaList}
        renderItem={(item, index) => (
          <Skeleton avatar title={false} loading={initLoading} active key={index}>
            <List.Item
              actions={[
                <IconText icon={LikeOutlined} text={item.likes.length} key="list-vertical-like-o" />,
                <IconText icon={DislikeOutlined} text={item.dislikes.length} key="list-vertical-dislike-o" />,
                <IconText icon={MessageOutlined} text={item.comments.length} key="list-vertical-message" />,
              ]}
            >
              <List.Item.Meta
                style={{
                  maxHeight: 400,
                  overflow: 'hidden',
                }}
                avatar={
                  item.isAnonymous ? (
                    <Tooltip title="Anonymous user" color="#2db7f5" mouseEnterDelay={1}>
                      <Avatar icon={<UserOutlined />} />
                    </Tooltip>
                  ) : (
                    <Tooltip title={item?.publisherId?.name} color="#2db7f5" mouseEnterDelay={1}>
                      <Avatar
                        style={{ backgroundColor: ColorList[index % 4], verticalAlign: 'middle' }}
                        size="large"
                        src={item?.publisherId?.avatar}
                      />
                    </Tooltip>
                  )
                }
                title={<a onClick={() => navigate(`/idea?id=${item._id}`)}>{item?.title}</a>}
                description={
                  <div dangerouslySetInnerHTML={{ __html: item?.content }} style={{ pointerEvents: 'none' }} />
                }
              />
            </List.Item>
          </Skeleton>
        )}
      />
    </>
  )
}

export default LatestIdeaList
