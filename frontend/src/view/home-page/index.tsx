import { SmileFilled } from '@ant-design/icons'
import { Avatar, Badge, Col, Input, Layout, message, Row } from 'antd'
import { Http } from 'next/api/http'
import useRoleNavigate from 'next/libs/use-role-navigate'
import { handleFilter } from 'next/utils/handleFilter'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useSubscription } from '../../libs/global-state-hook'
import useWindowSize from '../../utils/useWindowSize'
import { userStore } from '../auth/user-store'
import IdeasList from '../ideas/ideas-list'
import ManagerBar from './manager-homepage-bar'
import MenuFilter from './menu-filter'
import IdeasTable from './idea-table'

function HomePage(props: { accessRole?: string }) {
  const { accessRole } = props
  const navigate = useRoleNavigate()
  const windowWidth = useWindowSize()
  const [ideas, setIdeas] = useState([])
  const [isEnd, setEnd] = useState(false)
  const [filter, setFilter] = useState('new')
  const [optionsQuery, setOptionsQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalIdea, setTotalIdea] = useState(0)
  const fitPadding = windowWidth < 1000 ? '10px 0' : '10px 100px'
  const { avatar, role } = useSubscription(userStore).state
  const handleClickTyping = async () => {
    navigate('/submit')
  }

  useEffect(() => {
    setEnd(false)
    const query = handleFilter(filter)
    setOptionsQuery(query)
    loadMoreData(true, query, 1)
  }, [filter])

  const getTotalIdea = async () => {
    await Http.get('/api/v1/idea/totalIdea', { accessRole: accessRole || null })
      .then(res => setTotalIdea(res.data?.total))
      .catch(err => message.error('Failed to get total ideas!'))
  }

  useEffect(() => {
    getTotalIdea()
  }, [])

  const loadMoreData = (reset: boolean = false, filter?, page?) => {
    setLoading(true)
    const tabQuery = filter ? filter : optionsQuery
    const curPage = page ? page : currentPage
    console.log(curPage)
    const getAllIdeas = async () =>
      await Http.get(
        accessRole !== 'manager'
          ? `/api/v1/idea?page=${curPage}&${tabQuery}`
          : `/api/v1/idea/manager?page=${curPage}&${tabQuery}`
      )
        .then(res => {
          if (reset === true) {
            setIdeas(res.data.data)
            if (res.data?.next?.page) {
              setCurrentPage(res.data.next.page)
            }
            return
          }
          if (res.data?.next?.page) {
            setCurrentPage(res.data.next.page)
          } else {
            setEnd(true)
            setCurrentPage(1)
          }
          setIdeas(prev => [...ideas, ...res.data.data])
        })
        .catch(error => message.error('Failed to get all accounts !'))
        .finally(() => setLoading(false))
    getAllIdeas()
  }
  return (
    <Layout.Content
      style={{
        display: 'block',
        padding: fitPadding,
        height: 'auto',
      }}
    >
      {role === 'staff' ? (
        <StyledRow style={{}}>
          <Col flex="60px">
            <Badge status="success" count={<SmileFilled style={{ color: '#52c41a' }} />}>
              <Avatar shape="square" size={40} style={{ background: '#f6f7f8' }} src={avatar} />
            </Badge>
          </Col>
          <Col flex="auto">
            <Input
              style={{ lineHeight: 2.15, background: '#f6f7f8' }}
              placeholder="Create Your Idea"
              onClick={() => {
                handleClickTyping()
              }}
            ></Input>
          </Col>
        </StyledRow>
      ) : role === 'manager' ? (
        <ManagerBar />
      ) : null}
      <StyledRow style={{}}>
        <MenuFilter setFilter={setFilter} filter={filter} totalIdea={totalIdea} />
      </StyledRow>
      {accessRole !== 'manager' ? (
        <IdeasList ideas={ideas} loading={loading} loadMoreData={loadMoreData} isEnd={isEnd} />
      ) : (
        <IdeasTable ideas={ideas} loading={loading} />
      )}
    </Layout.Content>
  )
}

export default HomePage

export const StyledRow = styled(Row)`
  padding: 10px;
  box-shadow: rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em;
  border: 1px solid #ccc;
  border-radius: 5px;
  background: #fff;
  margin-bottom: 15px;
`
// src="https://joesch.moe/api/v1/random" />
