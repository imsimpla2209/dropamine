import { Badge, Button, DatePicker, Descriptions, Select } from 'antd'
import { Http } from 'next/api/http'
import { useEffect, useState } from 'react'
import { exportExcel } from './home-page-services'

const { RangePicker } = DatePicker

export default function ManagerBar() {
  const [selectedItems, setSelectedItems] = useState()
  const [categories, setCategories] = useState([])
  const [dates, setDates] = useState({})
  const getCategoryList = async () => {
    await Http.get('/api/v1/category')
      .then(res => {
        setCategories(res.data.data)
      })
      .catch(error => console.log(error.message))
  }

  const handleDateChange = (value, dateString) => {
    console.log(dateString)
    setDates({
      from: dateString[0],
      to: dateString[1],
    })
  }

  const handleOnChangeCate = e => {
    setSelectedItems(e)
  }

  const handleExportExcel = async () => {
    if (!selectedItems && !dates) {
      return exportExcel()
    } else {
      exportExcel({ cate: selectedItems, dates: dates })
      // setDates({})
      // setSelectedItems(null)
    }
  }

  useEffect(() => {
    getCategoryList()
  }, [])

  return (
    <div
      style={{
        backgroundColor: '#fff',
        border: '1px solid #fff',
        borderRadius: '8px',
        padding: '10px',
        marginBottom: '10px',
        boxShadow: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em',
      }}
    >
      <Descriptions title="Ideas Management" bordered column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
        <Descriptions.Item label="Export data from" span={3}>
          <Badge status="processing" text="Leaks Database" />
        </Descriptions.Item>
        <Descriptions.Item label="By Categories">
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Search to Select"
            optionFilterProp="children"
            onChange={e => {
              handleOnChangeCate(e)
            }}
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={categories.map(item => ({
              value: item._id,
              label: item.name,
            }))}
          />
        </Descriptions.Item>

        <Descriptions.Item label="By Time Range" span={2}>
          <RangePicker
            onChange={handleDateChange}
            format="YYYY-MM-DD HH:mm"
            dateRender={current => {
              const style: React.CSSProperties = {}
              if (current.date() === 1) {
                style.border = '1px solid #1890ff'
                style.borderRadius = '50%'
              }
              return (
                <div className="ant-picker-cell-inner" style={style}>
                  {current.date()}
                </div>
              )
            }}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Action">
          <Button type="primary" onClick={() => handleExportExcel()}>
            Export to CSV
          </Button>
        </Descriptions.Item>
      </Descriptions>
    </div>
  )
}
