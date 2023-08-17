import { Form, Input, message, Modal } from 'antd'
import { useSnackbar } from 'notistack'
import { Http } from '../../api/http'

export default function AddDepartmentModal({
  isOpen,
  onCloseModal,
  setDeparments,
  deparments,
  setLoading,
  currentDepartment,
}) {
  const { enqueueSnackbar } = useSnackbar()
  const [form] = Form.useForm()

  const onFinish = async () => {
    if (!form.getFieldValue('name')) {
      message.error('Name is empty!')
    } else if (currentDepartment?.name !== form.getFieldValue('name')) {
      const accountForm = {
        name: form.getFieldValue('name'),
        _id: currentDepartment?._id || null,
      }
      await Http.post('/api/v1/department', accountForm)
        .then(() => {
          if (currentDepartment?._id) {
            setDeparments(
              deparments.map(category => {
                if (category._id === currentDepartment._id) {
                  category.name = form.getFieldValue('name')
                }
                return category
              })
            )
          } else {
            setDeparments([accountForm, ...deparments])
          }

          onCloseModal()
        })
        .catch(error => enqueueSnackbar(error.message, { variant: 'error' }))
    } else {
      message.error('Please type a different name!')
    }
    form.resetFields()
  }

  return (
    <Modal
      open={isOpen}
      onCancel={() => {
        onCloseModal()
        form.resetFields()
      }}
      title={currentDepartment?.name ? `Edit ${currentDepartment.name}` : 'Add new department'}
      onOk={onFinish}
      destroyOnClose
    >
      <Form labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} layout="horizontal" style={{ width: '100%' }} form={form}>
        <Form.Item name="name" label="Department name" labelAlign="left" required>
          <Input placeholder="Business,..." allowClear defaultValue={currentDepartment?.name} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
