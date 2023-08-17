import { DeleteOutlined } from '@ant-design/icons'
import { Button, Modal, message } from 'antd'
import { format } from 'date-fns'
import { Http } from 'next/api/http'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import styled from 'styled-components'

const ConfirmModal = ({ open, onClose, handleRestore }) => (
  <Modal
    open={open}
    title="Restore version history"
    cancelText={'Cancel'}
    cancelButtonProps={{ danger: true }}
    okText={'Restore'}
    onCancel={onClose}
    onOk={handleRestore}
  >
    <p>Are you sure to restore this version history?</p>
  </Modal>
)

export default function ListDBItem({
  db,
  setListDB,
  setLoadingRestore,
  loadingRestore,
  restoringVersion,
  setRestoringVersion,
}) {
  const { enqueueSnackbar } = useSnackbar()
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const formatTime = (time: string) => {
    return format(new Date(Number(time)), 'H:mm, MMM d, yyyy')
  }
  const handleDeleteDBVersionHistory = async () => {
    setLoading(true)
    await Http.post('/api/v1/backup/drop', { name: db.name })
      .then(res => {
        message.success(`Version history at ${formatTime(db.name.split('COMP-1640-version-')?.[1])} deleted!`)
        setListDB(database => database.filter(item => item.name !== db.name))
      })
      .catch(error => {
        enqueueSnackbar('Failed to delete backup data!', { variant: 'error' })
      })
      .finally(() => setLoading(false))
  }

  const handleRestoreVersionHistory = async () => {
    setRestoringVersion(db.name)
    setLoadingRestore(true)
    setOpenConfirmModal(false)
    await Http.post('/api/v1/backup/restore', { name: db.name })
      .then(res => {
        message.success(
          `Restore version history at ${formatTime(db.name.split('COMP-1640-version-')?.[1])} successfully!`
        )
      })
      .catch(error => {
        enqueueSnackbar('Failed to restore data!', { variant: 'error' })
      })
      .finally(() => {
        setLoadingRestore(false)
      })
  }

  return (
    <>
      <ListItem onClick={() => !loading && setOpenConfirmModal(true)}>
        <div style={{ justifyContent: 'space-between', alignItems: 'center' }} className="d-flex">
          <p> Version at {formatTime(db.name.split('COMP-1640-version-')?.[1])}</p>
          <Button
            loading={loading || (loadingRestore && restoringVersion === db.name)}
            type="text"
            danger={!(loadingRestore && restoringVersion === db.name)}
            icon={<DeleteOutlined />}
            onClickCapture={e => {
              e.stopPropagation()
              handleDeleteDBVersionHistory()
            }}
          />
        </div>
      </ListItem>
      <ConfirmModal
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        handleRestore={handleRestoreVersionHistory}
      />
    </>
  )
}

const ListItem = styled.div`
  &:hover {
    background: #cecece77;
  }
  padding: 16px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
`
