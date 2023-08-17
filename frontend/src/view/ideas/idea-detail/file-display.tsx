import {
  FileExcelOutlined,
  FileFilled, FileImageOutlined,
  FilePdfOutlined,
  FilePptOutlined,
  FileWordOutlined,
  FileZipOutlined,
  PaperClipOutlined,
  PlayCircleOutlined
} from '@ant-design/icons'
import { Button, List, Typography } from 'antd'

const handleFile = file => {
  const ext = file.toString().substring(file.toString().lastIndexOf('.') + 1)
  switch (ext) {
    case 'pdf':
      return <FileCard title="PDF file" item={file} chilren={<FilePdfOutlined style={{color:'#FF4E50'}} />}></FileCard>
    case 'jpeg':
    case 'png':
    case 'jpg':
    case 'tiff':
    case 'gif':
    case 'svg':
    case 'webp':
    case 'webg':
      return <FileCard title="Image file" item={file} chilren={<FileImageOutlined style={{color: '#9B57B0'}} />}></FileCard>
    case 'doc':
    case 'docx':
    case 'txt':
      return <FileCard title="Text/word file" item={file} chilren={<FileWordOutlined style={{color: '#49708A'}} />}></FileCard>
    case 'zip':
    case 'rar':
      return <FileCard title="Zip file" item={file} chilren={<FileZipOutlined style={{color: '#EB6841'}} />}></FileCard>
    case 'xls':
    case 'xlsx':
    case 'csv':
      return <FileCard title="Excel file" item={file} chilren={<FileExcelOutlined style={{color: '#519548'}} />}></FileCard>
    case 'ppt':
    case 'pptx':
      return <FileCard title="Powerpoint file" item={file} chilren={<FilePptOutlined style={{color: '#CC333F'}} />}></FileCard>
    default:
      return <FileCard title="Other file" item={file} chilren={<FileFilled style={{color: '#ccc'}} />}></FileCard>
  }
}

const FileCard = ({ title, item, chilren }) => (
  <List.Item
    style={{ 
      padding: '0 16px',
      border: '1px solid #ccc',
      borderRadius: '5px',
    }}
    actions={[
      <Button key="list-loadmore-edit" icon={<PlayCircleOutlined />} type='text' href={item} target="_blank" rel="noreferrer">
        Preview
      </Button>,
    ]}
  >
    <span style={{ fontSize: '35px', margin: '0' }}>{chilren}</span>
    <div>
      <Typography>{title}</Typography>
    </div>
  </List.Item>
)

export default function FileDisplay({files, isFit } : {files: any, isFit?: any}) {
  return (
    <List
      style={{ margin: isFit ? '0' : '0 24px' }}
      header={
        <>
          <PaperClipOutlined /> <Typography.Text strong>Attachments</Typography.Text>
        </>
      }
      bordered
      itemLayout="horizontal"
      dataSource={files}
      renderItem={item => handleFile(item)}
    />
  )
}
