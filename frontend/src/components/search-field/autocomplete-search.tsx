/* eslint-disable jsx-a11y/anchor-is-valid */
import { AutoComplete, message } from 'antd'
import type { SelectProps } from 'antd/es/select'
import { Http } from 'next/api/http'
import useRoleNavigate from 'next/libs/use-role-navigate'
import { useSocket } from 'next/socket.io'
import { ideaCount } from 'next/view/layout/header'
import { useEffect, useState } from 'react'

const getRandomInt = (max: number, min = 0) => Math.floor(Math.random() * (max - min + 1)) + min

function AutoSearch() {
  const [suggest, setSuggest] = useState([])
  const [options, setOptions] = useState<SelectProps<object>['options']>([])
  const [numberOfIdea, setNumberOfIdea] = useState(0)
  const navigate = useRoleNavigate()
  const { appSocket } = useSocket()
  const updateTotalIdea = data => setNumberOfIdea(data?.total || 0)

  useEffect(() => {
    appSocket.on('total_idea', updateTotalIdea)
    return () => {
      appSocket.off('total_idea', updateTotalIdea)
    }
  }, [updateTotalIdea])

  useEffect(() => {
    const getSuggestions = async () =>
      await Http.get('/api/v1/idea/suggest')
        .then(res => {
          setSuggest(res.data.data)
          ideaCount.updateState({ number: res.data.count })
        })
        .catch(error => message.error('Failed to get suggestions!'))
    getSuggestions()
  }, [numberOfIdea])

  const handleClickSearch = (id: string, refresh?) => {
    if (refresh === true) {
      window.location.reload()
    }
    navigate(`/idea?id=${id}`)
  }

  const searchResult = (query: string) => {
    const searchResults = suggest.filter(
      s => s?.title?.replaceAll(' ', '').toLowerCase().includes(query.replaceAll(' ', '').toLowerCase()) === true
    )

    return searchResults.map((sug, idx) => {
      const data = `${sug['title']}`
      const check = data.indexOf(query)
      return {
        value: data,
        key: sug['_id'],
        label: (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
            key={sug['_id']}
          >
            <span>
              <a href="" onClick={() => handleClickSearch(sug['_id'])} target="_blank" rel="noopener noreferrer">
                {data.slice(0, check + 20)}...
              </a>
            </span>
            <span>{getRandomInt(2, 1)} results </span>
          </div>
        ),
      }
    })
  }

  const handleSearch = (value: string) => {
    setOptions(value ? searchResult(value) : [])
  }

  const onSelect = (key: string) => {
    handleClickSearch(key, true)
  }

  return (
    <AutoComplete
      dropdownMatchSelectWidth={278}
      style={{ width: '60%', height: 40, marginTop: '10px', borderRadius: '5px' }}
      options={options}
      onSelect={onSelect}
      onSearch={handleSearch}
      placeholder="Search here"
      notFoundContent="Nothing matches the search😏🥱"
    >
      {/* <Input.Search size="middle" placeholder="Search here" allowClear /> */}
    </AutoComplete>
  )
}

export default AutoSearch
