import { ArrowLeftOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Button, Card, Checkbox, Form, Input, Space, Spin, Switch, Typography, message } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { ContentState, EditorState, convertFromHTML, convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import RichTextEditor from 'next/components/text-editor'
import TermCondition from 'next/components/upload/term-conditions'
import { DefaultUpload } from 'next/components/upload/upload'
import useRoleNavigate from 'next/libs/use-role-navigate'
import { useQuery } from 'next/utils/use-query'
import { useEffect, useState } from 'react'
import { Http } from '../../api/http'
import useWindowSize from '../../utils/useWindowSize'
import HashtagInput from './create-new-idea/HastagInput'
import Tags from './create-new-idea/tag'
import FileDisplay from './idea-detail/file-display'
import { BlueColorButton } from 'next/components/custom-style-elements/button'

const { Title } = Typography

const fetchPresignedUrl = async (url: any, file: any) => {
  try {
    const fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1)
    const type = file.type
    const requestUrl = url + `?ext=${fileExtension}&type=${type}`
    const uploadConfig = await Http.get(requestUrl)
    // const uploadFileToS3 = await axios.put(uploadConfig.data.url, file.originFileObj, {
    //   headers: {
    //     'Content-Type': type,
    //   },
    // })

    return `https://yessir-bucket-tqt.s3.ap-northeast-1.amazonaws.com/${uploadConfig.data.key}`
  } catch (error) {
    console.error(error)
  }
}

const fetchAllToS3 = async (files: any) => {
  const url = '/api/v1/idea/preSignUrl'
  const requests = files.map(async (file: any) => {
    return await fetchPresignedUrl(url, file).then(result => result)
  })

  return Promise.all(requests)
}

export default function EditIdea() {
  const [data, setData] = useState([])
  const [form] = Form.useForm()
  const navigate = useRoleNavigate()
  const query = useQuery()
  const id = query.get('id')
  const initialState = () => EditorState.createEmpty()
  const [editorState, setEditorState] = useState(initialState)
  const [openModal, setOpenModal] = useState(false)
  const [files, setFiles] = useState([])
  const [categories, setCategories] = useState([])
  const [isAnonymous, setAnonymous] = useState(false)
  const [isShown, setIsShown] = useState(false)
  const setFileState = async (value: never[]) => {
    setFiles(value)
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShown(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const getIdea = async () =>
      await Http.get(`/api/v1/idea/detail?id=${id}`)
        .then(res => {
          setData([res.data.data])
          const blocksFromHtml = convertFromHTML(`${res.data.data.content}`)
          const initialState = () =>
            EditorState.createWithContent(
              ContentState.createFromBlockArray(blocksFromHtml.contentBlocks, blocksFromHtml.entityMap)
            )
          setEditorState(initialState)
        })
        .catch(error => message.error('Failed to fetch idea!'))
    getIdea()
  }, [])

  const [allHastag, setAllHastag] = useState([])

  const getHastagList = async () => {
    await Http.get('/api/v1/hastag')
      .then(res => {
        setAllHastag(res.data.data)
      })
      .catch(error => message.error(error.message))
  }

  useEffect(() => {
    getHastagList()
  }, [])

  const normFile = (e: any) => {
    const fileList = e
    setFileState(fileList)
    return e
  }

  const onSubmitPost = async () => {
    const content = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    if(content.length <= 20) {
      return message.error("Your description is too sparsing")
    }
    const postForm = {
      title: form.getFieldValue('title'),
      content: `${content}`,
      categories: categories,
      isAnonymous: isAnonymous,
    }
    if(categories.length === 0) {
      return message.error('At least one tags')
    }

    if (!postForm.title || !postForm.content) {
      return message.error('Please fill the required fields')
    }
    if (postForm.title.length < 30) {
      return message.error('Your title is too sparsing')
    }
    if (!form.getFieldValue('agreement')) {
      return message.error('You must agree to the terms and conditions')
    }
    if (files) {
      let fileNameList = await fetchAllToS3(files)
      postForm['files'] = fileNameList
    }

    await Http.put(`/api/v1/idea/edit/${id}`, postForm)
      .then(res => {
        message.success('Edit Idea successfully!!')
        navigate('/')
      })
      .catch(error => message.error(error.message + '. Please try again'))
  }

  const windowWidth = useWindowSize()

  return isShown ? (
    <Card
      title={
        <Space align="center" size="middle">
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/')} />
          <Title style={{ fontSize: 18, margin: 0 }}> Edit your idea</Title>
        </Space>
      }
      style={{ minWidth: windowWidth < 969 ? 'unset' : '80%', borderRadius: 0, marginRight: 10 }}
    >
      <Form
        form={form}
        name="idea"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        layout="horizontal"
        labelAlign="left"
      >
        <Form.Item name="event" label="Chosen Special Event" initialValue={data[0]?.specialEvent?.title}>
          <Input style={{ lineHeight: 2.15 }} disabled></Input>
        </Form.Item>

        <Form.Item name="title" label="Title" initialValue={data[0]?.title}
        rules={[{ required: true, message: "Please input your idea's title" }, { type: 'string', min: 30, message: "Your title is too sparsing, at least 30 characters" }]} 
        >
          <Input
            style={{ lineHeight: 2.15 }}
            placeholder="Title (at least 50 characters to summary your idea)"
            maxLength={200}
            showCount
            autoComplete="off"
          ></Input>
        </Form.Item>

        <Form.Item name="content" required label="Description">
          <RichTextEditor editorState={editorState} setEditorState={setEditorState} />
        </Form.Item>

        <DefaultUpload normFile={normFile} files={files}></DefaultUpload>

        {data[0]?.files.length > 0 && (
          <Form.Item name="addedFile" label="Original files(can't remove)">
            <FileDisplay files={data[0]?.files} isFit={true}></FileDisplay>
          </Form.Item>
        )}

        <Form.Item label="Anonymous Mode">
          <Switch
            defaultChecked={data[0]?.isAnonymous ? true : false}
            onChange={() => setAnonymous(!isAnonymous)}
            checkedChildren="On"
            unCheckedChildren="Off"
          />
        </Form.Item>
        <Form.Item label="Category (max: 1)" 
        rules={[{ required: true, message: "At least one category, please" }]} 
        >
          <Tags setCategories={setCategories} selectedKeys={data[0]?.categories?.map(cate => cate._id)} />
        </Form.Item>

        <FormItem label="HashTags (Optional)" style={{ width: '100%' }}>
          <HashtagInput />
        </FormItem>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          required
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error('Must accept terms and conditions')),
            },
          ]}
        >
          <Checkbox defaultChecked>
            I have read and agreed to{' '}
            <Button
              type="link"
              style={{ padding: 0, margin: 0 }}
              icon={<QuestionCircleOutlined style={{ margin: 0, padding: 0 }} />}
              onClick={() => setOpenModal(true)}
            >
              Terms and Conditions{' '}
            </Button>
          </Checkbox>
        </Form.Item>
        <TermCondition isOpen={openModal} onCloseModal={() => setOpenModal(false)} />
        <Form.Item wrapperCol={{ span: 15 }}>
          <BlueColorButton type="primary" htmlType="submit" onClick={() => onSubmitPost()} style={{ marginTop: 10 }}>
            Accept Change
          </BlueColorButton>
        </Form.Item>
      </Form>
    </Card>
  ) : (
    <Space
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spin tip="Loading, wait a few" size="large" style={{}}>
        <div className="content" style={{ width: '200px', textAlign: 'center' }}>
          {' '}
          ...{' '}
        </div>
      </Spin>
    </Space>
  )
}
