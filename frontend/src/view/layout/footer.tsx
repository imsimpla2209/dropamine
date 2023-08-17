import { Space, Typography } from 'antd'
import { imgDir } from '../../constants/img-dir'
import useWindowSize from '../../utils/useWindowSize'

const { Title, Paragraph, Link } = Typography

function AppFooter() {
  const windowWidth = useWindowSize()
  const displayType = windowWidth < 969 ? 'horizontal' : 'vertical'
  return (
    <div style={{ display: 'block', background: '#556270' }}>
      <Space align="start" style={{ width: ' 100%' }} size={80}>
        <a href={'/'} style={{ marginRight: 20, display: 'contents' }}>
          <img src={imgDir + 'logo.png'} height="60" alt="Logo" />
        </a>
        <Space direction="vertical">
          <Title
            level={3}
            style={{
              margin: 0,
              color: '#e2f9f6',
            }}
          >
            Created By Team Member:
          </Title>
          <Paragraph>
            {windowWidth < 969 ? (
              <></>
            ) : (
              <ul style={{ color: '#ccc' }}>
                <li>Nguyen Quang Huy</li>
                <li>Nguyen Huy Hoang</li>
                <li>Tran Quang Khai</li>
                <li>Tran Doan Dung</li>
                <li>Hoang Dinh Hien</li>
                <li>Pham Quang Huy</li>
              </ul>
            )}
          </Paragraph>
        </Space>
        <Space direction={displayType}>
          <Title
            level={3}
            style={{
              marginTop: 5,
              color: '#e2f9f6',
            }}
          >
            Github resource
          </Title>
          <Paragraph>
            <Link href="https://github.com/NguyenQuangHuy282002/COMP1640">Open in Github</Link>
          </Paragraph>
        </Space>
      </Space>
    </div>
  )
}

export default AppFooter
