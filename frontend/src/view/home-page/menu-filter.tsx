import {
  CrownFilled,
  DingtalkCircleFilled,
  FireFilled,
  FrownFilled,
  RocketFilled,
  SlidersFilled,
} from '@ant-design/icons'
import { Button, Col, Dropdown, MenuProps, Radio, Space, Typography } from 'antd'
import styled from 'styled-components'
import useWindowSize from '../../utils/useWindowSize'

const { Text } = Typography

function MenuFilter({ setFilter, filter, totalIdea }) {
  const windowWidth = useWindowSize()
  const display = windowWidth < 1000 ? 'block' : 'flex'
  const onClickFilter = (val: any) => {
    setFilter(val)
  }
  const topItems: MenuProps['items'] = [
    {
      key: 'week',
      label: (
        <Text style={{ fontSize: 15, margin: 0 }} onClick={() => onClickFilter('week')}>
          Week
        </Text>
      ),
    },
    {
      key: 'month',
      label: (
        <Text style={{ fontSize: 15, margin: 0 }} onClick={() => onClickFilter('month')}>
          Month
        </Text>
      ),
    },
  ]

  // const departmentItems: MenuProps['items'] = [
  //   {
  //     key: 'computing',
  //     label: (
  //       <Text style={{ fontSize: 15, margin: 0 }} onClick={() => onClickFilter('computing')}>
  //         Computing
  //       </Text>
  //     ),
  //   },
  //   {
  //     key: 'desgin',
  //     label: (
  //       <Text style={{ fontSize: 15, margin: 0 }} onClick={() => onClickFilter('desgin')}>
  //         Desgin
  //       </Text>
  //     ),
  //   },
  //   {
  //     key: 'bussiness',
  //     label: (
  //       <Text style={{ fontSize: 15, margin: 0 }} onClick={() => onClickFilter('bussiness')}>
  //         Bussiess
  //       </Text>
  //     ),
  //   },
  //   {
  //     key: 'ABC',
  //     label: (
  //       <Text style={{ fontSize: 15, margin: 0 }} onClick={() => onClickFilter('ABC')}>
  //         ABC
  //       </Text>
  //     ),
  //   },
  // ]

  // const categoryItems: MenuProps['items'] = [
  //   {
  //     key: 'teaching',
  //     label: (
  //       <Text style={{ fontSize: 15, margin: 0 }} onClick={() => onClickFilter('teaching')}>
  //         Teaching
  //       </Text>
  //     ),
  //   },
  //   {
  //     key: 'study',
  //     label: (
  //       <Text style={{ fontSize: 15, margin: 0 }} onClick={() => onClickFilter('study')}>
  //         Study
  //       </Text>
  //     ),
  //   },
  //   {
  //     key: 'deadline',
  //     label: (
  //       <Text style={{ fontSize: 15, margin: 0 }} onClick={() => onClickFilter('deadline')}>
  //         Deadline
  //       </Text>
  //     ),
  //   },
  // ]

  const moreItems: MenuProps['items'] = [
    {
      key: 'your-department',
      label: (
        <Text style={{ fontSize: 15, margin: 0 }} onClick={() => onClickFilter('your-department')}>
          Your Department
        </Text>
      ),
    },
    {
      key: 'your-ideas',
      label: (
        <Text style={{ fontSize: 15, margin: 0 }} onClick={() => onClickFilter('your-ideas')}>
          Your Ideas
        </Text>
      ),
    },
  ]
  return (
    <>
      <Col>
        <p style={{ fontSize: '19px', fontWeight: '400', marginBottom: '3px 0' }}>{totalIdea} Ideas</p>
      </Col>
      <Col style={{ float: 'right', width: '100%', justifyContent: 'end', fontSize: '15px', display: display }}>
        <Radio.Group defaultValue={filter} buttonStyle="solid" style={{}} onChange={e => onClickFilter(e.target.value)}>
          <StyledRadioButton value="new">
            <DingtalkCircleFilled /> Newest
          </StyledRadioButton>
          <StyledRadioButton value="hot">
            <FireFilled /> Hot
          </StyledRadioButton>
          <StyledRadioButton value="best">
            <RocketFilled /> Best
          </StyledRadioButton>
          <StyledRadioButton value="worst">
            <FrownFilled /> Worst
          </StyledRadioButton>
          <StyledRadioButton value="oldest">
            <FrownFilled /> Oldest
          </StyledRadioButton>
        </Radio.Group>
        <Col />
        <Col>
          <Space wrap style={{ float: 'right' }}>
            {/* <Dropdown menu={{ items: departmentItems }} placement="bottom" arrow trigger={['click']}>

              <Button>
                <GroupOutlined /> Department
              </Button>
            </Dropdown>
            <Dropdown menu={{ items: categoryItems }} placement="bottom" arrow trigger={['click']}>
              <Button>
                <PicRightOutlined />Category
              </Button>
            </Dropdown> */}
            <Dropdown menu={{ items: topItems }} placement="bottom" arrow trigger={['click']}>
              <Button>
                <CrownFilled /> Top
              </Button>
            </Dropdown>
            <Dropdown menu={{ items: moreItems }} placement="bottom" arrow trigger={['click']}>
              <Button>
                <SlidersFilled />
              </Button>
            </Dropdown>
          </Space>
        </Col>
      </Col>
    </>
  )
}

const StyledRadioButton = styled(Radio.Button)`
  :visited {
    background-color: #ccc;
  }
`

export default MenuFilter
