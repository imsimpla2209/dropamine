import { SmileOutlined } from '@ant-design/icons'
import { Divider, message, Space, Switch } from 'antd'
import Picker from 'emoji-picker-react'
import { Http } from 'next/api/http'
import useWindowSize from 'next/utils/useWindowSize'
import { useEffect, useRef, useState } from 'react'
import './style.css'
interface Commentprops {
  user: any
  ideaId?: string
  setComments?: void
  setCount?: void
  email?: string
  setUpdateIdea?: any
}

export default function CreateComment(props: Commentprops) {
  const windowWidth = useWindowSize()
  const [picker, setPicker] = useState(false)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [text, setText] = useState('')
  const [cursorPosition, setCursorPosition] = useState()
  const textRef = useRef(null)

  const { user, ideaId, setComments, setCount, email, setUpdateIdea } = props

  useEffect(() => {
    textRef.current.selectionEnd = cursorPosition
  }, [cursorPosition])
  const handleEmoji = (e, emojiObject) => {
    const ref = textRef.current
    ref.focus()
    const start = text.substring(0, ref.selectionStart)
    const end = text.substring(ref.selectionStart)
    const newText = start + emojiObject.emoji + end
    setText(newText)
    setCursorPosition(start.length + emojiObject.emoji.length)
  }

  const handleSubmitComment = async () => {
    if (text.length === 0 || !text) {
      return message.error('Type your comment first !!')
    }
    const payload = {
      content: text,
      ideaId: ideaId,
      publisherEmail: email,
      isAnonymous: isAnonymous,
    }
    setText('')

    await Http.post('/api/v1/comment/create', payload)
      .then(res => {
        setUpdateIdea(prev => ++prev)
        return message.success('Your comment are hanlded')
      })
      .catch(error => message.error(`Something went wrong: ${error.response?.data?.message}`))
  }

  const _handleKeyDown = e => {
    if (e.key === 'Enter') {
      handleSubmitComment()
    }
  }

  return (
    <div className="create_comment_wrap" style={{
      position: 'relative',
    }}>
      <div className="create_comment">
        <img src={user?.avatar} alt={user?.name} />
        <div className="comment_input_wrap"
        
        >
          {picker && (
            <div className="comment_emoji_picker" style={{
              position: 'absolute',
              bottom: '50px'
            }}>
              <Picker onEmojiClick={(emoji, event) => handleEmoji(event, emoji)} />
            </div>
          )}
          <input
            type="text"
            ref={textRef}
            value={text}
            placeholder="Write a comment..."
            onChange={e => setText(e.target.value)}
            onKeyDown={e => _handleKeyDown(e)}
            autoComplete='off'
          />
          <div
            className="comment_circle_icon hover2"
            onClick={() => {
              setPicker(prev => !prev)
            }}
          >
            <i className="emoji_icon" style={{ color: '#9a9999', fontSize: '16px' }}>
              <SmileOutlined />
            </i>
          </div>
          <Divider type="vertical" style={{ color: 'black' }}></Divider>
          <Space style={{ justifyContent: 'end', display: 'flex', paddingLeft: '5px' }} direction="horizontal">
            {windowWidth > 1000 ? 'Anonymous:' : '🎭'}
            <Switch onChange={() => setIsAnonymous(!isAnonymous)} checkedChildren="On" unCheckedChildren="Off" />
          </Space>
          {/* <div className="comment_circle_icon hover2">
            <i className="gif_icon"></i>
          </div>
          <div className="comment_circle_icon hover2">
            <i className="sticker_icon"></i>
          </div> */}
        </div>
      </div>
    </div>
  )
}
