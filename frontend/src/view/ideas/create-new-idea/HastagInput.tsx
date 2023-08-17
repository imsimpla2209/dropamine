import { Input, Tag } from 'antd'
import { useState } from 'react'
import { Http } from '../../../api/http'

const { Search } = Input

function HashtagInput({ setHashTags }: { setHashTags? }) {
  const [inputValue, setInputValue] = useState('')
  const [hashtags, setHashtags] = useState([])

  const onSearch = async value => {
    if (value && value.trim() !== '') {
      const newHashtags = value.split(' ').filter(tag => tag.startsWith('@'))
      setHashtags(newHashtags)
    } else {
      setHashtags([])
    }
    try {
      const hashtags = value.match(/@(\w+)/g)
      if (!hashtags) return
      for (let hashtag of hashtags) {
        hashtag = hashtag.substring(1)
        const result = await Http.post('/api/v1/hastag', { name: hashtag })
        setHashTags(prev => [...prev, result?.data?.data?._id])
      }
      // setInputValue('');
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <Search
        value={inputValue}
        placeholder="Enter Hastag starting with '@' "
        enterButton="Add hastag"
        size="large"
        onChange={e => setInputValue(e.target.value)}
        onSearch={onSearch}
        style={{ marginBottom: '12px', width: '95%' }}
      />
      {hashtags.length > 0 && (
        <div style={{}}>
          {hashtags.map(tag => (
            <Tag
              color="orange"
              style={{ padding: '3px', color: 'blue', fontFamily: 'Georgia', fontSize: '14px', fontWeight: 'bold' }}
              key={tag}
            >
              {tag}
            </Tag>
          ))}
        </div>
      )}
    </>
  )
}

export default HashtagInput
