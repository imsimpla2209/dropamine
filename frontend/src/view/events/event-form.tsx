import { ArrowLeftOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Button, Card, DatePicker, Form, Input, Space, Tooltip, Typography } from 'antd'
import dayjs from 'dayjs'
import { ContentState, convertFromHTML, convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { Http } from 'next/api/http'
import RichTextEditor from 'next/components/text-editor'
import useWindowSize from 'next/utils/useWindowSize'
import { useSnackbar } from 'notistack'
import { useState } from 'react'

const { Title } = Typography
interface IEventModalProps {
  event?: any
  onClose: Function
  onFinish: (eventForm: any) => void
}

const DATE_FORMAT = 'YYYY-MM-DD HH:mm'

export default function CreateEventField(props: IEventModalProps) {
  const { onClose, onFinish, event } = props
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const windowWidth = useWindowSize()
  const initialState = () => EditorState.createEmpty()
  const blockHTML = convertFromHTML(event?.description || '')
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(ContentState.createFromBlockArray(blockHTML.contentBlocks, blockHTML.entityMap)) ||
      initialState
  )
  const [form] = Form.useForm()

  const [startDate, setStartDate] = useState(event?.startDate)

  const initFormValues = {
    title: event?.title || '',
  }
  const handleOnFinish = async () => {
    setLoading(true)
    const eventForm = {
      _id: event?._id || null,
      title: form.getFieldValue('title'),
      description: draftToHtml(convertToRaw(editorState.getCurrentContent())),
      startDate: form.getFieldValue('startDate').$d,
      firstCloseDate: form.getFieldValue('firstCloseDate').$d,
      finalCloseDate: form.getFieldValue('finalCloseDate')
        ? form.getFieldValue('finalCloseDate').$d
        : form.getFieldValue('firstCloseDate').add(7, 'day').$d,
    }

    await Http.post('/api/v1/event', eventForm)
      .then(() => {
        onFinish(eventForm)
      })
      .catch(error => enqueueSnackbar(error.message, { variant: 'error' }))
      .finally(() => setLoading(false))
  }
  return (
    <Card
      title={
        <Space align="center" size="middle">
          <Button icon={<ArrowLeftOutlined />} onClick={() => onClose()} />
          <Title style={{ fontSize: 18, margin: 0 }}> Event form</Title>
        </Space>
      }
      style={{ minWidth: windowWidth < 969 ? 'unset' : '80%', borderRadius: 0, height: '100vh' }}
    >
      <Form
        initialValues={initFormValues}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        layout="horizontal"
        style={{ width: '100%', padding: 16 }}
        form={form}
        onFinish={handleOnFinish}
      >
        <Form.Item
          name="title"
          label="Title"
          labelAlign="left"
          required
          rules={[
            {
              required: true,
              message: 'Please input event title!',
            },
          ]}
        >
          <Input placeholder="Enter event title" maxLength={100} />
        </Form.Item>
        <Form.Item label="Description" labelAlign="left">
          <RichTextEditor editorState={editorState} setEditorState={setEditorState} />
        </Form.Item>

        <Form.Item
          name="startDate"
          label="Start date"
          labelAlign="left"
          required
          initialValue={event?.startDate ? dayjs(event?.startDate, DATE_FORMAT) : null}
        >
          <DatePicker
            showTime={{ format: 'HH:mm' }}
            format={DATE_FORMAT}
            disabledDate={current => current && current < dayjs().endOf('day')}
            onChange={setStartDate}
          />
        </Form.Item>
        <Form.Item
          name="firstCloseDate"
          label="First closure date"
          labelAlign="left"
          required
          initialValue={event?.firstCloseDate ? dayjs(event?.firstCloseDate, DATE_FORMAT) : null}
        >
          <DatePicker
            disabled={!startDate}
            showTime={{ format: 'HH:mm' }}
            format={DATE_FORMAT}
            disabledDate={current => {
              return current && current < form.getFieldValue('startDate')
            }}
          />
        </Form.Item>

        <Form.Item
          name="finalCloseDate"
          label={
            <Space>
              Final closure date
              <Tooltip
                title="Final closure date will be set 7 days after first closure date by default!"
                color="#52c41a"
              >
                <InfoCircleOutlined style={{ color: '#1a83c4' }} />
              </Tooltip>
            </Space>
          }
          labelAlign="left"
          initialValue={event?.finalCloseDate ? dayjs(event?.finalCloseDate, DATE_FORMAT) : null}
        >
          <DatePicker
            showTime={{ format: 'HH:mm' }}
            format={DATE_FORMAT}
            disabledDate={current => {
              return current && current < form.getFieldValue('firstCloseDate')?.add(7, 'day')
            }}
          />
        </Form.Item>
        <Form.Item style={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}
