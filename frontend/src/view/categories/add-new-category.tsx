import { Form, Input, message, Modal } from 'antd'
import { useSnackbar } from 'notistack'
import { Http } from '../../api/http'

export default function AddCategoryModal({
  isOpen,
  onCloseModal,
  setLoading,
  setCategoriesList,
  categoriesList,
  currentCategory,
}) {
  const { enqueueSnackbar } = useSnackbar()
  const [form] = Form.useForm()

  const onFinish = async () => {
    if (!form.getFieldValue('name')) {
      message.error('Name is empty!')
    } else if (currentCategory?.name !== form.getFieldValue('name')) {
      setLoading(true)
      const categoryForm = {
        name: form.getFieldValue('name'),
        _id: currentCategory?._id || null,
        ideas: [],
      }
      await Http.post('/api/v1/category', categoryForm)
        .then(() => {
          if (currentCategory?._id) {
            setCategoriesList(
              categoriesList.map(category => {
                if (category._id === currentCategory._id) {
                  category.name = form.getFieldValue('name')
                }
                return category
              })
            )
          } else {
            setCategoriesList([categoryForm, ...categoriesList])
          }
          onCloseModal()
        })
        .catch(error => enqueueSnackbar(error.message, { variant: 'error' }))
        .finally(() => setLoading(false))
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
      title="Create new category"
      onOk={onFinish}
      destroyOnClose
    >
      <Form labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} layout="horizontal" style={{ width: '100%' }} form={form}>
        <Form.Item name="name" label="Category name" labelAlign="left" required>
          <Input placeholder="IT, Design, ..." allowClear defaultValue={currentCategory?.name} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
