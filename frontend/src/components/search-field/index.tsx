import { Input } from 'antd'

const { Search } = Input

function SearchField({ searchKey, setSearchKey, placeholder }) {
  return (
    <Search
      placeholder={placeholder}
      allowClear
      onSearch={() => {}}
      value={searchKey}
      onChange={e => setSearchKey(e.target.value)}
    />
  )
}

export default SearchField
