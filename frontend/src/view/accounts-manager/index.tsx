import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { Button, Card, Row, Space, Switch, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useSnackbar } from 'notistack'
import { useEffect, useMemo, useState } from 'react'
import { Http } from '../../api/http'
import AddAccountModal from './add-new-account'
import SearchField from '../../components/search-field'
import EditAccountModal from './edit-account'

interface DataType {
  id: string
  username: string
  email: string
  role: string
  active: boolean
}

const AddAccount = ({ openModal }) => (
  <Button type="primary" icon={<PlusCircleOutlined />} onClick={openModal}>
    Add new account
  </Button>
)

function AccountManager() {
  const { enqueueSnackbar } = useSnackbar()
  const [accounts, setAccounts] = useState([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [loading, setLoading] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [searchKey, setSearchKey] = useState('')

  const filteredAccounts = useMemo(() => {
    return accounts?.filter((acc: DataType) => acc.username.toLowerCase().includes(searchKey.toLowerCase().trim()))
  }, [accounts, searchKey])

  const handleDeleteAccount = async id => {
    await await Http.delete('/api/v1/users/deleteUser', id)
      .then(res => setAccounts(accounts.filter(acc => acc._id !== id)))
      .catch(error => enqueueSnackbar('Failed to delete account !', { variant: 'error' }))
  }

  const handleChangeActiveAccount = async (id, active) => {
    await await Http.post(`/api/v1/users/${active ? 'activeUser' : 'deactiveUser'}`, { id })
      .then(res =>
        setAccounts(
          accounts.map(acc => {
            if (acc._id === id) {
              acc.isActivate = active
            }
            return acc
          })
        )
      )
      .catch(error => enqueueSnackbar('Failed to update account !', { variant: 'error' }))
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: '_id',
      width: '20%',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'username',
      sorter: (a: DataType, b: DataType) => a.username.length - b.username.length,
      width: '30%',
      key: 'username',
    },

    {
      title: 'Role',
      dataIndex: 'role',
      width: '15%',
      filters: [
        {
          text: 'Admin',
          value: 'admin',
        },
        {
          text: 'Staff',
          value: 'staff',
        },
        {
          text: 'QA Manager',
          value: 'manager',
        },
        {
          text: 'Coordinator',
          value: 'coordinator',
        },
      ],
      onFilter: (value: any, record: DataType) => record.role.indexOf(value) === 0,
      key: 'role',
      align: 'center',
    },
    {
      title: 'Status',
      dataIndex: 'isActivate',
      render: (_, record: any) =>
        record.isActivate ? <Tag color="success">Active</Tag> : <Tag color="error">Inactive</Tag>,
      width: '15%',
      key: 'Status',
      align: 'center',
    },
    {
      title: 'Actions',
      render: (_, record: any) => (
        <Space wrap>
          <Switch
            checked={record.isActivate}
            onChange={() => handleChangeActiveAccount(record._id, !record.isActivate)}
          />
          <Button type="text" icon={<EditOutlined />} onClick={() => setEditModal(record)} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteAccount(record._id)} />
        </Space>
      ),
      width: '20%',
      key: 'Actions',
      align: 'center',
    },
  ]

  const getAllUser = async () =>
    await Http.get('/api/v1/users')
      .then(res => setAccounts(res.data.data))
      .catch(error => enqueueSnackbar('Failed to get all accounts !', { variant: 'error' }))
      .finally(() => setLoading(false))

  useEffect(() => {
    setLoading(true)
    getAllUser()
  }, [])

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  }

  return (
    <Row gutter={16} style={{ padding: '20px', margin: 0 }}>
      <Card
        title="All accounts"
        extra={<AddAccount openModal={() => setOpenModal(true)} />}
        bordered={false}
        style={{ width: '100%' }}
        bodyStyle={{ overflow: 'scroll', height: loading ? '500px' : 'auto', minHeight: '500px' }}
      >
        <SearchField setSearchKey={setSearchKey} searchKey={searchKey} placeholder="Search accounts by name" />
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredAccounts.sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )}
          loading={loading}
        />
      </Card>
      <EditAccountModal
        userProfile={editModal}
        onCloseModal={() => setEditModal(null)}
        onSubmit={() => {
          setLoading(true)
          getAllUser()
        }}
      />
      <AddAccountModal
        isOpen={openModal}
        onCloseModal={() => setOpenModal(false)}
        onSubmit={() => {
          setLoading(true)
          getAllUser()
        }}
      />
    </Row>
  )
}

export default AccountManager
