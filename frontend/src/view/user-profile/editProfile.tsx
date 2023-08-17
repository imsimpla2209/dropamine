import { PlusOutlined } from '@ant-design/icons'
import { Button, DatePicker, Form, Input, Row, Space, Typography, Upload, message } from 'antd'
import dayjs from 'dayjs'
import { Http } from 'next/api/http'
import { useSubscription } from 'next/libs/global-state-hook'
import { userStore } from '../auth/user-store'
import { handleValidateFile, onChangeUpload, previewFile } from 'next/components/upload/upload'
import { useState } from 'react'
import { fetchAllToS3 } from '../ideas/create-new-idea'

const { Title } = Typography
const DATE_FORMAT = 'YYYY-MM-DD HH:mm'

function EditProfileForm() {
  const { state, setState } = useSubscription(userStore)
  const [form] = Form.useForm()
  const [files, setFiles] = useState(null)
  const [loading, setLoading] = useState(false)

  userStore.subscribe(newState => {
    form.setFieldsValue({
      name: newState?.name,
      username: newState?.username,
      phone: newState.phone,
      email: !newState.email || newState.email === 'None' ? '' : newState.email,
      birthday: newState?.birthday ? dayjs(newState?.birthday.toString(), DATE_FORMAT) : null,
    })
  })

  const onReset = () => {
    form.resetFields()
  }

  const handleUpdateProfile = async () => {
    setLoading(true)
    const userform = {
      name: form.getFieldValue('name'),
      username: form.getFieldValue('username'),
      phone: form.getFieldValue('phone'),
      email: form.getFieldValue('email'),
      birthday: form.getFieldValue('birthday')?.$d,
      avatar: undefined,
    }
    if (!form.getFieldValue('name') || !form.getFieldValue('username') || !form.getFieldValue('email')) {
      return message.error('Please input the required fields')
    }
    if (form.getFieldValue('username').length <= 4 || form.getFieldValue('name').length <= 10) {
      return message.error('Please input the valid fields')
    }

    if (files) {
      try {
        let fileNameList = await fetchAllToS3(files)
        userform['avatar'] = fileNameList[0]
      } catch (error) {
        console.error(error)
      }
    }

    await Http.put(`/api/v1/users/updateProfile/${state._id}`, userform)
      .then(() => {
        message.success('Updated profile successfully!')
        setState({
          name: form.getFieldValue('name'),
          username: form.getFieldValue('username'),
          phone: form.getFieldValue('phone'),
          email: form.getFieldValue('email'),
          birthday: form.getFieldValue('birthday')?.$d,
          avatar: userform?.avatar ? userform?.avatar : state.avatar,
        })
      })
      .catch(err => message.error('Failed to update profile!'))
      .finally(() => setLoading(false))
  }

  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      layout="horizontal"
      style={{ width: '100%' }}
      form={form}
      onFinish={handleUpdateProfile}
    >
      <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
        <Title level={3} style={{ margin: '0px 10px 16px' }}>
          General
        </Title>
      </Row>

      <Form.Item
        name="name"
        label="Full name"
        labelAlign="left"
        initialValue={state.name}
        rules={[
          { required: true, message: 'Please input your fullname' },
          { type: 'string', min: 10, message: 'Invalid fullname (At least 10 characters)' },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="username"
        label="Username"
        labelAlign="left"
        initialValue={state.username}
        rules={[
          { required: true, message: 'Please input your username' },
          { type: 'string', min: 3, message: 'Invalid username (At least 3 characters)' },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="phone"
        label="Phone number"
        labelAlign="left"
        initialValue={state.phone}
        rules={[
          {
            pattern: new RegExp(/^[0-9]{10}$/),
            message: 'The input is not valid phone number!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        labelAlign="left"
        initialValue={!state.email || state.email === 'None' ? '' : state.email}
        rules={[
          {
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          { required: true, message: 'Please input your email' },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="birthday"
        label="Date of birth"
        labelAlign="left"
        initialValue={
          typeof state?.birthday === 'string' && state?.birthday ? dayjs(state?.birthday, DATE_FORMAT) : null
        }
      >
        <DatePicker
          disabledDate={current => {
            return current && current > dayjs().endOf('day')
          }}
        />
      </Form.Item>

      <Form.Item
        name="image"
        label="Upload image"
        valuePropName="fileList"
        labelAlign="left"
        getValueFromEvent={e => {
          const validFiles = handleValidateFile(e)
          setFiles(validFiles)
        }}
      >
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          onPreview={previewFile}
          accept="image/*"
          beforeUpload={file => onChangeUpload(file)}
          maxCount={1}
        >
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
      </Form.Item>

      <Row gutter={{ xs: 8, sm: 16, md: 24 }} style={{ padding: '0px 16px' }}>
        <Form.Item>
          <Space direction="horizontal" align="end">
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
            <Button htmlType="button" onClick={onReset} danger>
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Row>
    </Form>
  )
}

export default EditProfileForm
