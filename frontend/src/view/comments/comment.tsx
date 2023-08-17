import {
  DeleteOutlined,
  DislikeOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  LikeOutlined,
} from '@ant-design/icons'
import { Avatar, List, Skeleton, Space, Typography } from 'antd'
import { imgDir } from 'next/constants/img-dir'
import { useSubscription } from 'next/libs/global-state-hook'
import React from 'react'
import { formatDayTime } from '../../utils/helperFuncs'
import { userStore } from '../auth/user-store'
import { deleteComment, editComment } from './comment-services'
import useRoleNavigate from 'next/libs/use-role-navigate'

const handleMenuClick = (text: unknown, id: unknown) => {
  switch (text) {
    case 'Edit':
      editComment(id)
      break
    case 'Delete':
      deleteComment(id)
      break
    default:
      return
  }
}

const IconText = ({ icon, text, id }: { icon: React.FC; text: string; id: string }) => (
  <Space style={{ cursor: 'pointer' }} onClick={() => handleMenuClick(text, id)}>
    {React.createElement(icon)}
    {text}
  </Space>
)

function Comment({ item, loading }) {
  const navigate = useRoleNavigate()
  const { _id } = useSubscription(userStore).state

  const handleViewProfile = id => {
    if (id !== 'Anonymous' && id !== 'Unknown') {
      navigate(`/profile?id=${id}`)
    }
  }

  let action = [
    <IconText id={item._id} icon={LikeOutlined} text="0" key="list-vertical-like-o" />,
    <IconText id={item._id} icon={DislikeOutlined} text="0" key="list-vertical-star-o" />,
    <IconText id={item._id} icon={ExclamationCircleOutlined} text="0" key="list-vertical-message" />,
  ]
  if (item.userId._id === _id) {
    action = [
      ...action,
      <IconText id={item._id} icon={EditOutlined} text="Edit" key="list-vertical-edit"></IconText>,
      <IconText id={item._id} icon={DeleteOutlined} text="Delete" key="list-vertical-delete"></IconText>,
    ]
  }

  return (
    <>
      {item?.date && (
        <List.Item actions={action} style={{ margin: 0 }}>
          <Skeleton avatar title={false} loading={loading} active>
            <List.Item.Meta
              style={{ margin: 0 }}
              avatar={
                <Avatar
                  size={45}
                  src={!item.isAnonymous ? item.userId?.avatar : imgDir + 'anonymous.jpg'}
                  style={{ background: '#ccc' }}
                />
              }
              title={
                <>
                  <Typography.Link onClick={() => !item.isAnonymous && handleViewProfile(item.userId?._id)}>
                    {!item.isAnonymous ? item.userId?.name : 'Anonymous'}
                  </Typography.Link>
                  {'  '}
                  <Typography.Text italic disabled type="secondary" style={{ fontSize: 13 }}>
                    {item.userId._id === _id ? 'Your Comment' : ''}
                  </Typography.Text>
                  <Typography.Paragraph
                    type="secondary"
                    style={{
                      fontSize: 13,
                      fontWeight: 0,
                      margin: 0,
                      fontFamily:
                        'Roboto,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol',
                    }}
                  >
                    {formatDayTime(item.date)}
                  </Typography.Paragraph>
                </>
              }
              // description={

              // }
            />
            <article
              style={{
                margin: 0,
                padding: 0,
                fontSize: '16px',
                fontWeight: '400',
                color: 'black',
                fontFamily:
                  'Open Sans,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica Neue,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol',
              }}
              dangerouslySetInnerHTML={{ __html: item.content }}
            ></article>
          </Skeleton>
        </List.Item>
      )}
    </>
  )
}

export default Comment
