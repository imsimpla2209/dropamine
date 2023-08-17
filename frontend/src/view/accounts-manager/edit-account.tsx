import { Col, Form, Input, Modal, Select, Space, Switch, Typography, message } from 'antd'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { Http } from '../../api/http'

export default function EditAccountModal({ userProfile, onCloseModal, onSubmit }) {
  const { enqueueSnackbar } = useSnackbar()
  const [form] = Form.useForm()
  const [accountRole, setAccountRole] = useState('')
  const [departmentOptions, setDepartmentOptions] = useState([])
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const getAllDepartment = async () =>
    await Http.get('/api/v1/department')
      .then(res => setDepartmentOptions(res.data.data))
      .catch(error => enqueueSnackbar('Failed to get all departments !', { variant: 'error' }))

  useEffect(() => {
    getAllDepartment()
    if (userProfile) {
      form.setFieldsValue({
        name: userProfile.name,
        username: userProfile.username,
        email: userProfile.email,
        role: userProfile.role,
        department: userProfile.department,
      })
    }
  }, [userProfile])

  const onFinish = async () => {
    if (!form.getFieldValue('name') || !form.getFieldValue('username') || !form.getFieldValue('email')) {
      return message.error('Please input the required fields')
    }
    if (form.getFieldValue('username').length <= 3 || form.getFieldValue('name').length <= 10) {
      return message.error('Please input the valid fields')
    }
    setLoading(true)
    const accountForm = {
      _id: userProfile._id,
      name: form.getFieldValue('name'),
      username: form.getFieldValue('username'),
      password: show ? form.getFieldValue('password') : null,
      email: form.getFieldValue('email'),
      role: form.getFieldValue('role'),
      department: form.getFieldValue('department'),
    }
    await Http.post('/api/v1/auth/edit', accountForm)
      .then(() => {
        onSubmit()
        onCloseModal()
      })
      .catch(error => enqueueSnackbar(error.message, { variant: 'error' }))
  }

  if (!userProfile?._id) return null

  return (
    <Modal
      open={userProfile}
      onCancel={() => {
        onCloseModal()
        form.resetFields()
      }}
      title="Edit account"
      onOk={onFinish}
    >
      <Form labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} layout="horizontal" style={{ width: '100%' }} form={form}>
        <Col span={24} style={{ padding: '16px 16px 0px 16px' }}>
          <Form.Item
            name="name"
            label="Full name"
            labelAlign="left"
            rules={[
              { required: true, message: 'Please input name' },
              { type: 'string', min: 10, message: 'Invalid name (At least 10 characters)' },
            ]}
          >
            <Input placeholder="Nguyen Van A" allowClear />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            labelAlign="left"
            required
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ]}
          >
            <Input placeholder="user@gmail.com" allowClear />
          </Form.Item>
          <Form.Item name="role" label="Role" labelAlign="left" required>
            <Select
              style={{ width: '100%' }}
              options={[
                { value: 'staff', label: 'Staff' },
                { value: 'manager', label: 'QA Manager' },
                { value: 'coordinator', label: 'QA Coordinator' },
              ]}
              onChange={setAccountRole}
              placeholder="Select role"
            />
          </Form.Item>
          {['coordinator', 'staff'].includes(accountRole) ? (
            <Form.Item name="department" label="Department" labelAlign="left" required>
              <Select
                style={{ width: '100%' }}
                options={departmentOptions.map(department => ({
                  value: department._id,
                  label: department.name,
                }))}
                placeholder="Select department"
              />
            </Form.Item>
          ) : null}
          <Form.Item
            name="username"
            label="Username"
            labelAlign="left"
            rules={[
              { required: true, message: 'Please input user name' },
              { type: 'string', min: 4, message: 'Invalid user name' },
            ]}
          >
            <Input placeholder="user" autoComplete="off" allowClear />
          </Form.Item>
          <Space align="center" style={{ justifyContent: 'center', marginBottom: 24 }}>
            <Typography.Text type="warning">Want to change password?</Typography.Text>
            <Switch checked={show} onChange={() => setShow(!show)} />
          </Space>
          {show && (
            <>
              <Form.Item
                name="password"
                label="New password"
                labelAlign="left"
                rules={[
                  { required: true, message: 'Please input password' },
                  { type: 'string', min: 6, message: 'Invalid password (at least 3 characters)' },
                ]}
              >
                <Input.Password autoComplete="off" allowClear />
              </Form.Item>
              <Form.Item
                name="re-password"
                label="Re-write new password"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: 'Please confirm your repassword!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('The two passwords that you entered do not match!'))
                    },
                  }),
                ]}
              >
                <Input.Password autoComplete="off" allowClear />
              </Form.Item>
            </>
          )}
        </Col>
      </Form>
    </Modal>
  )
}
