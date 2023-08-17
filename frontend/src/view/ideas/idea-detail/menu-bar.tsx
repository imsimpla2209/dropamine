import {
  CaretDownFilled,
  CaretUpFilled,
  CommentOutlined,
  DownloadOutlined,
  FireTwoTone,
  ShareAltOutlined,
} from '@ant-design/icons'
import { Button, message, Radio, Space, Typography } from 'antd'
import { Http } from 'next/api/http'
import { useSubscription } from 'next/libs/global-state-hook'
import { userStore } from 'next/view/auth/user-store'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import useWindowSize from '../../../utils/useWindowSize'
import { disLikeHandler, handleDownloadFiles, likeHandler, omitHandler } from './idea-detail-service'
import PointInfoModal from './points-info-modal'
import { useSocket } from 'next/socket.io'

let reactionTimeOut = null

export default function MenuBar({ commentCount, handleShowComment, ideaId, name, files }) {
  const { appSocket } = useSocket()
  const windowWidth = useWindowSize()
  const [likers, setLikers] = useState([])
  const [dislikers, setDisLikers] = useState([])
  const { state } = useSubscription(userStore)
  const [likesCount, setLikes] = useState(0)
  const [dislikesCount, setDisLikes] = useState(0)
  const [votesCount, setVotes] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisLiked, setIsDisLiked] = useState(false)
  const [openModal, setOpenModal] = useState(false)

  const fetchLikes = async (id: any) => {
    await Http.get(`/api/v1/idea/ideaLikes?ideaId=${id}`)
      .then(res => {
        setIsLiked(res.data.likes.findIndex((like: any) => like._id === state._id) >= 0)
        setIsDisLiked(res.data.dislikes.findIndex((like: any) => like._id === state._id) >= 0)
        setLikes(res.data.likes.length)
        setDisLikes(res.data.dislikes.length)
        setVotes(res.data.likes.length - res.data.dislikes.length)
        setLikers(res.data.likes)
        setDisLikers(res.data.dislikes)
      })
      .catch(error => {
        return message.error(error.message)
      })
  }

  const updateVoteRealTime = info => {
    if (info.user._id === state._id) return
    if (info.action === 'like') {
      if (dislikers.map(liker => liker._id).indexOf(info.user._id) >= 0) {
        setDisLikers(dislikers => {
          dislikers = dislikers.filter(l => l._id !== info.user._id)
          return dislikers
        })
        setDisLikes(prev => prev - 1)
        setVotes(votesCount => votesCount + 1)
      }
      setLikers(prev => [...prev, info.user])
      setVotes(votesCount => votesCount + 1)
      return setLikes(prev => prev + 1)
    } else if (info.action === 'dislike') {
      if (likers.map(liker => liker._id).indexOf(info.user._id) >= 0) {
        setLikers(likers => {
          likers = likers.filter(l => l._id !== info.user._id)
          return likers
        })
        setLikes(prev => prev - 1)
        setVotes(votesCount => votesCount - 1)
      }
      setDisLikers(prev => [...prev, info.user])
      setVotes(votesCount => votesCount - 1)
      return setDisLikes(prev => prev + 1)
    } else if (info.action === 'omit') {
      if (dislikers.map(liker => liker._id).indexOf(info.user._id) >= 0) {
        setDisLikers(dislikers => {
          dislikers = dislikers.filter(l => l._id !== info.user._id)
          return dislikers
        })
        setDisLikes(prev => prev - 1)
        setVotes(votesCount => votesCount + 1)
      } else if (likers.map(liker => liker._id).indexOf(info.user._id) >= 0) {
        setLikers(likers => {
          likers = likers.filter(l => l._id !== info.user._id)
          return likers
        })
        setLikes(prev => prev - 1)
        setVotes(votesCount => votesCount - 1)
      }
    }
  }

  useEffect(() => {
    appSocket.on('votes', data => {
      if (data.ideaId === ideaId) {
        updateVoteRealTime(data)
      }
    })
    return () => {
      appSocket.off('votes')
    }
  }, [updateVoteRealTime])

  useEffect(() => {
    return () => {
      if (isLiked) {
        likeHandler(ideaId)
      } else if (isDisLiked) {
        disLikeHandler(ideaId)
      }
    }
  }, [isLiked, isDisLiked])

  useEffect(() => {
    fetchLikes(ideaId)
  }, [ideaId])

  const handleLikePost = async () => {
    if (isLiked) {
      setVotes(votesCount => votesCount - 1)
      setLikes(likesCount => likesCount - 1)
      setIsLiked(isLiked => !isLiked)
      setLikers(likers => {
        likers = likers.filter(l => l._id !== state._id)
        return likers
      })
      reactionTimeOut && clearTimeout(reactionTimeOut)
      reactionTimeOut = setTimeout(() => omitHandler(ideaId), 200)
    } else {
      setVotes(votesCount => votesCount + 1)
      if (isDisLiked) {
        setDisLikes(dislikesCount => dislikesCount - 1)
        setIsDisLiked(isDisLiked => !isDisLiked)
        setVotes(votesCount => votesCount + 1)
      }
      setIsLiked(isLiked => !isLiked)
      setLikes(likesCount => likesCount + 1)
      setLikers(likers => [...likers, { _id: state._id, name: state.name, avatar: state.avatar }])
      setDisLikers(dislikers => {
        dislikers = dislikers.filter(l => l._id !== state._id)
        return dislikers
      })
      reactionTimeOut && clearTimeout(reactionTimeOut)
      reactionTimeOut = setTimeout(() => likeHandler(ideaId), 500)
    }
  }

  const handleDislikePost = async () => {
    if (isDisLiked) {
      setVotes(votesCount => votesCount + 1)
      setDisLikes(dislikesCount => dislikesCount - 1)
      setIsDisLiked(isDisLiked => !isDisLiked)
      setDisLikers(dislikers => {
        dislikers = dislikers.filter(l => l._id !== state._id)
        return dislikers
      })
      reactionTimeOut && clearTimeout(reactionTimeOut)
      reactionTimeOut = setTimeout(() => omitHandler(ideaId), 200)
    } else {
      setVotes(votesCount => votesCount - 1)
      if (isLiked) {
        setIsLiked(isLiked => !isLiked)
        setVotes(votesCount => votesCount - 1)
        setLikes(votesCount => votesCount - 1)
      }
      setDisLikes(dislikesCount => dislikesCount + 1)
      setIsDisLiked(isDisLiked => !isDisLiked)
      setLikers(likers => {
        likers = likers.filter(l => l._id !== state._id)
        return likers
      })
      setDisLikers(dislikers => [...dislikers, { _id: state._id, name: state.name, avatar: state.avatar }])
      reactionTimeOut && clearTimeout(reactionTimeOut)
      reactionTimeOut = setTimeout(() => disLikeHandler(ideaId), 500)
    }
  }

  return (
    <>
      {windowWidth > 969 ? (
        <>
          <Space
            style={{
              justifyContent: 'start',
              display: 'flex',
              padding: '20px 20px 0 20px',
              marginLeft: '4px',
              marginBottom: 0,
            }}
          >
            <Button
              icon={<FireTwoTone twoToneColor="#eb2f96" style={{}} />}
              onClick={() => setOpenModal(true)}
              type="link"
              style={{}}
              size="middle"
            >
              {votesCount} points
            </Button>
          </Space>
          <Space
            style={{
              justifyContent: 'start',
              display: 'flex',
              padding: '5px 20px 15px 20px',
              marginLeft: '4px',
              marginBottom: 0,
            }}
          >
            <StyledDiv>
              {isLiked ? (
                <StyledBtnLike
                  shape="round"
                  icon={<CaretUpFilled />}
                  onClick={() => handleLikePost()}
                  type="primary"
                  style={{ background: '#464F54', color: '#F2FDF7' }}
                >
                  {likesCount}
                </StyledBtnLike>
              ) : (
                <StyledBtnLike shape="round" icon={<CaretUpFilled />} onClick={() => handleLikePost()} type="text">
                  {likesCount}
                </StyledBtnLike>
              )}
              {isDisLiked ? (
                <StyledBtnDisLike
                  shape="round"
                  icon={<CaretDownFilled />}
                  onClick={() => handleDislikePost()}
                  type="primary"
                  style={{ backgroundColor: '#464F54', color: '#FFADA1' }}
                >
                  {dislikesCount}
                </StyledBtnDisLike>
              ) : (
                <StyledBtnDisLike
                  shape="round"
                  icon={<CaretDownFilled />}
                  onClick={() => handleDislikePost()}
                  type="text"
                >
                  {dislikesCount}
                </StyledBtnDisLike>
              )}
            </StyledDiv>
            <Button icon={<CommentOutlined />} onClick={() => handleShowComment()} style={{ cursor: 'pointer' }}>
              {commentCount} Comments
            </Button>
            <Button icon={<DownloadOutlined />} onClick={() => handleDownloadFiles(ideaId, name.slice(0, 24), files)}>
              DownLoad
            </Button>
            <Button icon={<ShareAltOutlined />}>Share</Button>
          </Space>
        </>
      ) : (
        <MobileMenuBar
          vote={votesCount}
          commentCount={commentCount}
          handleShowComment={handleShowComment}
          ideaId={ideaId}
          files={files}
        />
      )}
      <PointInfoModal
        isOpen={openModal}
        onCloseModal={() => setOpenModal(false)}
        likers={likers}
        dislikers={dislikers}
      />
    </>
  )
}

function str2bytes(str) {
  var bytes = new Uint8Array(str.length)
  for (var i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i)
  }
  return bytes
}

function MobileMenuBar({ vote, commentCount, handleShowComment, ideaId, files }) {
  return (
    <Space style={{ justifyContent: 'space-evenly', display: 'flex' }}>
      <Radio.Group>
        <Radio.Button value="like">
          <CaretUpFilled />
          <Typography.Text strong style={{ marginLeft: '0', width: '100%', fontSize: '13.5px', color: '#948C75' }}>
            {vote >= 0 ? <>+{vote}</> : <>{vote}</>}
          </Typography.Text>
        </Radio.Button>
        <Radio.Button value="dislike">
          <CaretDownFilled />
        </Radio.Button>
      </Radio.Group>
      <Button icon={<CommentOutlined />} onTouchEnd={() => handleShowComment()} style={{ cursor: 'pointer' }}>
        {commentCount}
      </Button>
      <Button icon={<DownloadOutlined />} onTouchEnd={() => handleDownloadFiles(ideaId, 'attachment', files)} />
      <Button icon={<ShareAltOutlined />} />
    </Space>
  )
}

const StyledDiv = styled(Space)`
  margin: auto;
  display: flex;
  text-align: center;
  justify-content: center;
  background-color: #e5e0e2;
  width: auto;
  border-radius: 100px;
  gap: 0 !important;
`

const StyledBtnLike = styled(Button)`
  border-bottom-right-radius: 0 !important;
  border-top-right-radius: 0 !important;
`

const StyledBtnDisLike = styled(Button)`
  border-bottom-left-radius: 0 !important;
  border-top-left-radius: 0 !important;
`
