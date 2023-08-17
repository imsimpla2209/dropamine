import { SmileOutlined } from '@ant-design/icons'
import { Avatar, ConfigProvider, List, Modal } from 'antd'

function PointInfoModal({ isOpen, onCloseModal, likers, dislikers }) {
  const customizeRenderEmpty = () => (
    <div style={{ textAlign: 'center', padding: 0, margin: 0, display: 'flex' }}>
      <p style={{ display: 'contents' }}>
        <SmileOutlined style={{ fontSize: 20, marginRight: 8 }} />
        No one :)))
      </p>
    </div>
  )
  return (
    <>
      <Modal
        title="Votes Info"
        open={isOpen}
        onCancel={() => {
          onCloseModal()
        }}
        onOk={() => {
          onCloseModal()
        }}
        width={354}
      >
        <ConfigProvider renderEmpty={customizeRenderEmpty}>
          <List
            header={<h4 style={{ color: 'black', margin: 0 }}>Likers</h4>}
            itemLayout="vertical"
            dataSource={likers || []}
            size="small"
            bordered
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  style={{ marginBlockEnd: 0 }}
                  avatar={<Avatar style={{ background: 'black' }} src={`${item['avatar']}`} />}
                  description={<a href="https://ant.design">{item['name']}</a>}
                />
              </List.Item>
            )}
          />
          <br />
          <List
            header={<h4 style={{ color: 'black', margin: 0 }}>Dislikers</h4>}
            bordered
            size="small"
            itemLayout="vertical"
            dataSource={dislikers || []}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  style={{ marginBlockEnd: 0, alignItems: 'center' }}
                  avatar={<Avatar style={{ background: 'black' }} src={`${item['avatar']}`} />}
                  description={<a href="https://ant.design">{item['name']}</a>}
                />
              </List.Item>
            )}
          />
        </ConfigProvider>
      </Modal>
    </>
  )
}

export default PointInfoModal
