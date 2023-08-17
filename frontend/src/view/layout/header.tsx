import { LogoutOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Dropdown, Layout, MenuProps, Row, Typography } from 'antd'
import useRoleNavigate from 'next/libs/use-role-navigate'
import { useSnackbar } from 'notistack'
import { useNavigate } from 'react-router-dom'
import AutoSearch from '../../components/search-field/autocomplete-search'
import { imgDir } from '../../constants/img-dir'
import { createSubscription, useSubscription } from '../../libs/global-state-hook'
import useWindowSize from '../../utils/useWindowSize'
import { userCredential, userStore } from '../auth/user-store'

const { Text } = Typography

export const ideaCount = createSubscription({ number: 0 })

function AppHeader() {
  const {
    state: { logout },
  } = useSubscription(userCredential)
  const navigate = useRoleNavigate()
  const navigator = useNavigate()
  const windowWidth = useWindowSize()
  const { enqueueSnackbar } = useSnackbar()
  const {
    state: { avatar, username },
  } = useSubscription(userStore, ['avatar', 'username'])

  const userMenu: MenuProps['items'] = [
    {
      key: 'account',
      label: (
        <Text style={{ fontSize: 20, margin: 0 }} onClick={() => handleClickMenu({ key: 'account' })}>
          Profile
        </Text>
      ),
      icon: <UserOutlined style={{ fontSize: 20 }} />,
    },
    {
      key: 'logout',
      label: (
        <Text style={{ fontSize: 20, margin: 0 }} onClick={() => handleClickMenu({ key: 'logout' })}>
          Logout
        </Text>
      ),
      icon: <LogoutOutlined style={{ fontSize: 20 }} />,
    },
  ]

  const handleLogout = () => {
    logout()
    navigator('/login')
    // window.location.reload();
    return enqueueSnackbar("You're logout! man")
  }

  const handleClickMenu = async (val: any) => {
    switch (val.key) {
      case 'logout':
        handleLogout()
        break
      default:
        navigate(`/${val.key}`)
    }
  }

  return (
    <Layout.Header
      style={{
        background: 'white',
        display: 'flex',
        position: 'sticky',
        zIndex: 2,
        boxShadow: 'rgba(17, 17, 26, 0.1) 0px 0px 16px',
        alignSelf: 'start',
        top: 0,
        width: '100%',
        height: '60px',
        lineHeight: 0,
        padding: windowWidth < 1300 ? '0px 10px' : '0px 50px',
      }}
    >
      <Row
        style={{
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '60px',
        }}
      >
        <>
          <a href={'/'} style={{ marginRight: 20, marginBottom: 5, display: 'contents' }}>
            <img src={imgDir + 'logo.png'} height="50" alt="Logo" />
          </a>
          <AutoSearch />
        </>
        {windowWidth < 1300 ? (
          <Dropdown menu={{ items: userMenu }} trigger={['click']} overlayStyle={{ width: 200 }} placement="bottom">
            <Button icon={<MenuOutlined />} type="text" />
          </Dropdown>
        ) : (
          <Dropdown menu={{ items: userMenu }} trigger={['click']} arrow overlayStyle={{ width: 150 }}>
            <Button type="text" className="d-flex center" style={{ height: 'unset', gap: '8px' }}>
              <Text style={{ fontWeight: 800 }}>{username}</Text>
              <Avatar
                style={{
                  backgroundColor: 'rgb(246 247 248)',
                  verticalAlign: 'middle',
                  boxShadow: 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px',
                }}
                size={40}
                gap={0}
                src={avatar}
              />
            </Button>
          </Dropdown>
        )}
      </Row>
    </Layout.Header>
  )
}

export default AppHeader
