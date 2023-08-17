import { Button, Table } from 'antd'
import { useState } from 'react'
import IdeaCard from '../ideas/idea-card'
import { DownloadOutlined } from '@ant-design/icons'
import { handleDownloadFiles } from '../ideas/idea-detail/idea-detail-service'

export default function IdeasTable({ ideas, loading }) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const onSelectChange = newSelectedRowKeys => {
    setSelectedRowKeys(newSelectedRowKeys)
  }
  const columns = [
    {
      title: 'Idea',
      render: idea => <IdeaCard key={`${idea}`} idea={idea} isLoading={loading} />,
    },
    {
      title: 'Action',
      render: idea => (
        <Button icon={<DownloadOutlined />} onClick={() => handleDownloadFiles(idea._id, idea.name, idea.files)} />
      ),
    },
  ]
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [Table.SELECTION_ALL],
  }
  return (
    <Table
      style={{ background: '#ffffff' }}
      rowSelection={rowSelection}
      columns={columns}
      dataSource={ideas.map(idea => ({
        ...idea,
        key: idea._id,
      }))}
    />
  )
}
