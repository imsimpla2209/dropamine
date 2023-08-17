import { Alert, Layout, Space, Spin, Typography, message } from 'antd'
import { Content } from 'antd/es/layout/layout'
import { Http } from 'next/api/http'
import { useSubscription } from 'next/libs/global-state-hook'
import { useSocket } from 'next/socket.io'
import { useQuery } from 'next/utils/use-query'
import { userStore } from 'next/view/auth/user-store'
import CreateComment from 'next/view/comments/create-comment'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import useWindowSize from '../../../utils/useWindowSize'
import CommentsList from '../../comments/comments-list'
import FileDisplay from './file-display'
import IdeaDetailInfo from './idea-detail-info'
import MenuBar from './menu-bar'

const { Text, Link } = Typography

function IdeaDetail() {
  const { appSocket } = useSocket()
  const [data, setData] = useState([])
  const [showComment, setShowComment] = useState(false)
  const [updateIdea, setUpdateIdea] = useState(0)
  const [commentCount, setCommentCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const query = useQuery()
  const id = query.get('id')
  const { name, avatar } = useSubscription(userStore).state
  const windowWidth = useWindowSize()
  const padding = windowWidth < 969 ? '10px 0' : '15px 60px 50px'

  const handleShowComment = () => {
    setShowComment(!showComment)
  }

  useEffect(() => {
    setLoading(true)
    const getIdea = async () =>
      await Http.get(`/api/v1/idea/detail?id=${id}`)
        .then(res => {
          setData([res.data.data])
          setCommentCount(res.data.data.comments.length)
        })
        .catch(error => message.error('Failed to fetch idea !'))
        .finally(() => setLoading(false))
    getIdea()
  }, [])

  const updateCommentLength = info => {
    if (info.action === 'create') {
      return setCommentCount(commentCount + 1)
    } else {
      return setCommentCount(commentCount - 1)
    }
  }

  useEffect(() => {
    appSocket.on('comments', data => {
      if (data.ideaId === id) {
        updateCommentLength(data)
      }
    })
    return () => {
      appSocket.off('comments')
    }
  }, [updateCommentLength])

  return (
    <>
      {!loading ? (
        <Layout className="layout" style={{ padding: padding }}>
          <StyledContent>
            <Space direction="horizontal" align="start">
              <Space style={{ padding: '16px 28px 0' }} direction="vertical">
                <IdeaDetailInfo item={data[0]}></IdeaDetailInfo>
                <ReadMore>{data[0]?.content}</ReadMore>

                <Space>
                  {data[0]?.hashtags.length !== 0
                    ? data[0]?.hashtags?.map(tag => (
                        <div
                          style={{
                            backgroundColor: '#f4f4f5',
                            color: '#9ba1af',
                            padding: '5px',
                            borderRadius: '5px',
                            border: '2px',
                          }}
                        >
                          @{tag.name}
                        </div>
                      ))
                    : null}
                </Space>

                <br></br>
              </Space>
            </Space>
            {data[0]?.files.length > 0 && <FileDisplay files={data[0]?.files}></FileDisplay>}
            <MenuBar
              commentCount={commentCount}
              ideaId={id}
              handleShowComment={handleShowComment}
              name={data[0]?.title}
              files={data[0]?.files}
            />
          </StyledContent>
          {new Date(data[0]?.specialEvent?.finalCloseDate) > new Date() ? (
            <StyledContent>
              <Space
                style={{
                  padding: '10px 24px',
                  width: '100%',
                }}
                direction="vertical"
              >
                <Text>
                  Comment as
                  <Text strong> {name}</Text>
                </Text>
                <CreateComment
                  user={{ avatar, name }}
                  setUpdateIdea={setUpdateIdea}
                  ideaId={id}
                  email={data[0]?.publisherId?.email}
                />
              </Space>
            </StyledContent>
          ) : (
            <Alert
              showIcon
              message={
                <Typography.Text type="danger" style={{ fontSize: '18px' }}>
                  This Idea Has Reach The Final Closure Date, You Are Not Allow To Comment Anymore
                </Typography.Text>
              }
              type="error"
            />
          )}
          {showComment ? (
            <StyledContent>
              <div style={{ width: '100%' }}>
                <CommentsList id={id} updateIdea={updateIdea} />
              </div>
            </StyledContent>
          ) : null}
        </Layout>
      ) : (
        <>
          <Spin tip="Loading, wait a few" size="large" style={{ marginTop: 80 }}>
            <div className="content" style={{ width: '200px', textAlign: 'center' }}>
              {' '}
              ...{' '}
            </div>
          </Spin>
        </>
      )}{' '}
    </>
  )
}

export default IdeaDetail

function ReadMore({ children }) {
  const text: string = children
  const [isReadMore, setIsReadMore] = useState(true)
  const textDisplay: string = isReadMore ? text?.slice(0, 1500) : text
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore)
  }
  return (
    <>
      <RenderHtml text={textDisplay}></RenderHtml>
      <Link onClick={toggleReadMore} className="read-or-hide">
        {isReadMore ? '...read more' : ' show less'}{' '}
      </Link>
    </>
  )
}

export function RenderHtml(prop: any) {
  const { text } = prop
  return <div style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: text }}></div>
}

const StyledContent = styled(Content)`
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  height: 100%;
  padding-bottom: 16px;
  margin-bottom: 16px;
`
