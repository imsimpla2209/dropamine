import { Form, Switch, Transfer, message } from 'antd'
import type { TransferDirection } from 'antd/es/transfer'
import { useEffect, useState } from 'react'
import { Http } from '../../../api/http'

interface RecordType {
  key: string
  title: string
  description: string
  chosen: boolean
}

function Tags({ setCategories, selectedKeys }: { setCategories: any; selectedKeys?: any }) {
  const [targetKeys, setTargetKeys] = useState<string[]>(selectedKeys || [])
  const [categoryList, setCategoryList] = useState([])
  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    const getAllCate = async () => {
      await Http.get('/api/v1/category')
        .then(res => {
          const categoryData = res.data.data.map(category => ({
            key: category?._id.toString(),
            title: `${category?.name}`,
            description: `${category?.name}`,
          }))
          setCategoryList(categoryData)
        })
        .catch(err => message.error(`Failed to get categories`))
    }
    getAllCate()
  }, [])

  const filterOption = (inputValue: string, option: RecordType) => option.description.indexOf(inputValue) > -1

  const handleChange = (selectedKeys: string[]) => {
    if (selectedKeys.length > 1) {
      return message.info('Maximum: 1 Category!!!')
    }
    setTargetKeys(selectedKeys)
  }

  const handleSearch = (dir: TransferDirection, value: string) => {
    console.log('search:', dir, value)
  }

  const handleConfirm = (checked: boolean) => {
    setDisabled(checked)
    setCategories(targetKeys)
  }

  return (
    <>
      <Transfer
        titles={['Avai', 'Yours']}
        locale={{
          itemUnit: 'Categories',
          itemsUnit: 'Categories',
          notFoundContent: 'The list is empty',
          searchPlaceholder: 'Search Categories here',
        }}
        dataSource={categoryList}
        showSearch
        disabled={disabled}
        filterOption={filterOption}
        targetKeys={targetKeys}
        onChange={handleChange}
        onSearch={handleSearch}
        render={item => item.title}
      />
      <br />
      <Form.Item label="Comfirm Category" required>
        <Switch
          unCheckedChildren="Not Yet"
          checkedChildren="Confirm"
          checked={disabled}
          onChange={handleConfirm}
        />
      </Form.Item>
    </>
  )
}

export default Tags
