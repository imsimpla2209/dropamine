import {
  ClockCircleFilled,
  CompassOutlined,
  DeleteTwoTone,
  EditTwoTone,
  EyeOutlined,
  FireTwoTone,
  LinkedinOutlined,
  MessageTwoTone,
  PaperClipOutlined,
  TagsTwoTone,
  UserOutlined,
} from '@ant-design/icons'
import { Avatar, Card, Empty, List, Popconfirm, Skeleton, Space, Tag, Typography } from 'antd'
import { imgDir } from 'next/constants/img-dir'
import { useSubscription } from 'next/libs/global-state-hook'
import useRoleNavigate from 'next/libs/use-role-navigate'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { formatDayTime } from '../../utils/helperFuncs'
import useWindowSize from '../../utils/useWindowSize'
import { userStore } from '../auth/user-store'
import { handleDeleteIdea } from './idea-detail/idea-detail-service'

const { Text, Link } = Typography
// eslint-disable-next-line react-hooks/rules-of-hooks

function IdeaCard({ idea, isLoading }) {
  const windowWidth = useWindowSize()
  const [open, setOpen] = useState(false)
  const { _id } = useSubscription(userStore).state
  const navigate = useRoleNavigate()
  const [loading, setLoading] = useState(true)
  const [isDeleted, setIsDeleted] = useState(false)

  const onChange = (checked: boolean) => {
    setLoading(isLoading)
  }
  useEffect(() => {
    onChange(loading)
  }, [isDeleted, setIsDeleted])

  const description = idea.content?.replace(/(<([^>]+)>)/gi, '').slice(0, 70) + '...'
  const showPopconfirm = () => {
    setOpen(true)
  }

  const handleOk = () => {
    setIsDeleted(true)
    setOpen(false)
    return handleDeleteIdea(idea?._id)
  }

  const handleCancel = () => {
    console.log('Clicked cancel button')
    setOpen(false)
  }

  const handleViewDetail = id => {
    navigate(`/idea?id=${id}`)
  }

  const handleViewProfile = id => {
    if (id !== 'Anonymous' && id !== 'Unknown') {
      navigate(`/profile?id=${id}`)
    }
  }

  const actions =
    idea?.publisherId?._id === _id
      ? [
          <EditTwoTone key="edit" onClick={() => navigate(`/idea/edit?id=${idea?._id}`)} />,

          <Popconfirm
            title="Warning"
            description="Are you sure you wanna delete it??"
            open={open}
            onConfirm={handleOk}
            onCancel={handleCancel}
          >
            <DeleteTwoTone key="delete" onClick={showPopconfirm} />
          </Popconfirm>,
        ]
      : []

  return isDeleted ? (
    <>
      <StyledCard
        style={{
          width: '100%',
          marginTop: 16,
        }}
        bodyStyle={{ padding: '2px' }}
      >
        <Empty
          description={
            <h4 style={{ color: '#FA6900' }}>This idea has been deleted, reload and it'll be disappeared</h4>
          }
        />
      </StyledCard>
    </>
  ) : (
    <>
      <StyledCard
        style={{
          width: '100%',
          marginTop: 16,
        }}
        bodyStyle={{ padding: '2px' }}
        actions={actions}
      >
        <Skeleton loading={loading} avatar active>
          <List.Item
            actions={
              windowWidth > 900
                ? [
                    <Text strong key="list-vertical-star-o">
                      <FireTwoTone twoToneColor={'#FE4365'} style={{ padding: '5px' }} />
                      {idea?.meta?.likesCount - idea?.meta?.dislikesCount || 0} points
                    </Text>,
                    <Text key="list-vertical-like-o">
                      <Tag color="cyan" style={{ margin: 0 }}>
                        <MessageTwoTone /> {idea.comments.length} comments
                      </Tag>
                    </Text>,
                    // <Text key="list-vertical-lock">
                    //   <Tag color="volcano" style={{ margin: 0 }}>
                    //     <LockTwoTone /> cannot comments
                    //   </Tag>
                    // </Text>,
                    <Text type="secondary" key="list-vertical-message">
                      <EyeOutlined style={{ padding: '5px' }} />
                      {idea.meta.views} views
                    </Text>,
                    <Text key="list-vertical-files">
                      <Tag color="#828DAB" style={{ margin: 0 }}>
                        <PaperClipOutlined style={{ padding: '5px 5px 5px 0' }} />
                        {idea?.files?.length || 0} attachments
                      </Tag>
                    </Text>,
                  ]
                : [
                    <Text strong key="list-vertical-star-o">
                      <FireTwoTone style={{ paddingRight: '2px' }} />
                      {idea.like - idea.dislike}
                    </Text>,
                    <Text key="list-vertical-like-o">
                      <Tag color="cyan">
                        <MessageTwoTone /> {idea.comments.length}
                      </Tag>
                    </Text>,
                    <Text type="secondary" key="list-vertical-message">
                      <EyeOutlined style={{ paddingRight: '2px' }} />
                      {idea.views}
                    </Text>,
                  ]
            }
          >
            <List.Item.Meta
              key={idea._id}
              avatar={
                !idea?.isAnonymous && idea?.publisherId?.name ? (
                  <Avatar style={{ margin: '0px' }} size={45} src={idea?.publisherId?.avatar} />
                ) : (
                  <Avatar style={{ margin: '0px' }} size={45} icon={<UserOutlined />} />
                )
              }
              title={
                <Space wrap direction="horizontal" size={'small'}>
                  <Link
                    onClick={() =>
                      handleViewProfile(!idea.isAnonymous ? idea.publisherId?._id ?? 'Unknown' : 'Anonymous')
                    }
                    style={{ fontSize: '15px', fontWeight: '500', marginRight: '10px' }}
                  >
                    {!idea.isAnonymous ? idea.publisherId?.name ?? 'Account deleted' : 'Anonymous'}
                  </Link>
                  <Typography.Text type="secondary">
                    <Tag icon={<LinkedinOutlined />} color="#007E80">
                      {/* 373B44 004853 */}
                      <strong>
                        {idea?.publisherId?.department?.name ? idea?.publisherId?.department?.name : 'No department'}
                      </strong>
                    </Tag>
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    <Tag
                      icon={<CompassOutlined />}
                      color="#FA6900"
                      className="ellipsis"
                      style={{ maxWidth: '-webkit-fill-available' }}
                    >
                      <strong>{idea.specialEvent?.title ? idea.specialEvent?.title : 'No Event'}</strong>
                    </Tag>
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    <ClockCircleFilled /> Posted {formatDayTime(idea.createdAt)}
                  </Typography.Text>
                </Space>
              }
              style={{ margin: '0' }}
            />

            <List.Item.Meta
              style={{ margin: '0' }}
              key="01"
              title={
                <Link>
                  <StyleTitle level={4} style={{ margin: 0 }} onClick={() => handleViewDetail(idea._id)}>
                    {idea.title}
                  </StyleTitle>
                </Link>
              }
              description={
                <>
                  <Typography.Text type="secondary">{description}</Typography.Text>
                  <Space size={[0, 8]} wrap>
                    <TagsTwoTone style={{ padding: '5px' }} />
                    {idea.categories.length !== 0 ? (
                      idea.categories.map(tag => (
                        <Tag key={tag.name} color="geekblue">
                          {tag.name}
                        </Tag>
                      ))
                    ) : (
                      <Tag>No Tag</Tag>
                    )}
                  </Space>
                </>
              }
            ></List.Item.Meta>
          </List.Item>
        </Skeleton>
        {/* <Typography.Text type="danger" style={{ marginLeft: "30px", fontSize: "18px", fontFamily: "Palatino Linotype" }}>Time has exceeded Finalclosededdate</Typography.Text> */}
      </StyledCard>
    </>
  )
}

const StyledCard = styled(Card)`
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`
const StyleTitle = styled(Typography.Title)`
  margin: 0px;
  &:hover {
    color: #007e80;
  }
`

export default IdeaCard
