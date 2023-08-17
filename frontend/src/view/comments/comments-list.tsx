import { SlidersFilled } from '@ant-design/icons'
import { Button, Dropdown, List, MenuProps, Space, Typography } from 'antd'
import { Http } from 'next/api/http'
import { useSocket } from 'next/socket.io'
import { handleFilter } from 'next/utils/handleFilter'
import { useEffect, useState } from 'react'
import Comment from './comment'
interface DataType {
  gender?: string
  name: {
    title?: string
    first?: string
    last?: string
  }
  email?: string
  picture: {
    large?: string
    medium?: string
    thumbnail?: string
  }
  nat?: string
  loading: boolean
}

function CommentsList({ id, updateIdea }) {
  const { appSocket } = useSocket()
  const [initLoading, setInitLoading] = useState(true)
  const [list, setList] = useState<DataType[]>([])
  const [filter, setFilter] = useState('new')

  const updateComments = info => {
    return setList([info.comment, ...list])
  }

  useEffect(() => {
    const query = handleFilter(filter)
    Http.get(`/api/v1/comment?ideaId=${id}&${query}`).then(res => {
      setInitLoading(false)
      setList(res.data.data)
    })
  }, [updateIdea, filter])

  
  const onClickFilter = (val: any) => {
    setFilter(val)
  }

  useEffect(() => {
    appSocket.on('comments', data => {
      if (data.ideaId === id) {
        updateComments(data)
      }
    })

    return () => {
      appSocket.off('comments')
    }
  }, [updateComments])


  const moreItems: MenuProps['items'] = [
    {
      key: 'new',
      label: (
        <Typography.Text style={{ fontSize: 15, margin: 0 }} onClick={() => onClickFilter('new')}>
          Newest
        </Typography.Text>
      ),
    },
    {
      key: 'oldest',
      label: (
        <Typography.Text style={{ fontSize: 15, margin: 0 }} onClick={() => onClickFilter('oldest')}>
          Oldest
        </Typography.Text>
      ),
    },
  ]

  return (
    <>
      <Space
        style={{
          width: '100%',
          borderBottom: '0.5px #ccc solid',
          padding: '10px',
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <Dropdown menu={{ items: moreItems }} placement="bottom" arrow trigger={['click']}>
          <Button>
            <SlidersFilled />
          </Button>
        </Dropdown>
      </Space>
      <List
        loading={initLoading}
        itemLayout="vertical"
        pagination={{
          onChange: (page) => {
            console.log(page);
          },
          pageSize: 5,
        }}
        dataSource={list}
        style={{ width: '100%' }}
        renderItem={item => (
          <Comment item={item} loading={item.loading} />
        )}
      />
    </>
  )
}

export default CommentsList
