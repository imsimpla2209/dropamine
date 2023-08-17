import { Card, List, Progress, Result, Space, Typography } from 'antd'
import { Http } from 'next/api/http'
import { BlueColorButton } from 'next/components/custom-style-elements/button'
import RubikLoader from 'next/components/loader/rubik-loader'
import { useSocket } from 'next/socket.io'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import ListDBItem from './list-item'

const { Text, Title } = Typography

let countSuccess = 0

export default function BackupDataManager() {
  const { enqueueSnackbar } = useSnackbar()
  const { appSocket } = useSocket()
  const [loading, setLoading] = useState(false)
  const [loadingListDB, setLoadingListDB] = useState(false)
  const [failToBackUp, setFailToBackUp] = useState(false)
  const [percents, setPercents] = useState(0)
  const [listDB, setListDB] = useState([])
  const [loadingRestore, setLoadingRestore] = useState(false)
  const [restoringVersion, setRestoringVersion] = useState('')

  const backupData = async () => {
    setFailToBackUp(false)
    setLoading(true)
    setPercents(0)
    await Http.get('/api/v1/backup')
      .catch(error => {
        enqueueSnackbar('Failed to backup data!', { variant: 'error' })
        setLoading(false)
        setFailToBackUp(true)
      })
      .finally(() => countSuccess++)
  }

  const backupProcessing = data => {
    setPercents(Math.ceil((Number(data.progress) / Number(data.total)) * 100))
  }

  const getAllBackups = async () => {
    setLoadingListDB(true)
    await Http.get('/api/v1/backup/all')
      .then(res => setListDB(res.data.data))
      .catch(error => {
        enqueueSnackbar('Failed to backup data!', { variant: 'error' })
      })
      .finally(() => setLoadingListDB(false))
  }

  useEffect(() => {
    if (!loading) {
      getAllBackups()
    }
  }, [loading])

  useEffect(() => {
    appSocket.on('backup', backupProcessing)
    return () => {
      appSocket.off('backup', backupProcessing)
    }
  }, [backupProcessing])

  useEffect(() => {
    if (percents === 100) {
      setTimeout(() => {
        setLoading(false)
      }, 300)
    }
  }, [percents])

  return (
    <Space direction="vertical" style={{ padding: 20 }} className="w-100">
      <Title style={{ margin: 0, marginBottom: 20 }}>Backup data feature!</Title>
      {!loadingRestore && (
        <BlueColorButton loading={loading} onClick={backupData} disabled={loading}>
          Start backup data
        </BlueColorButton>
      )}

      {loadingRestore && (
        <>
          <RubikLoader />
          <Text>Restoring version history...</Text>
        </>
      )}

      {loading && (
        <>
          <RubikLoader />
          <Text>In progress...</Text>
          <Progress percent={percents} strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />
        </>
      )}
      {!loadingRestore && !loading && !failToBackUp && countSuccess > 0 && (
        <Space direction="vertical" className="w-100 center" style={{ paddingTop: 50 }}>
          <Progress type="circle" percent={100} strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />
          <Title>Backup data successfull!</Title>
        </Space>
      )}
      {!loadingRestore && !loading && failToBackUp && countSuccess > 0 && (
        <Result status="error" title="Backup data failed" subTitle="Please trying to backup data again!" />
      )}
      <Card
        title="Version history"
        bordered={false}
        className="w-100"
        style={{ marginTop: 16 }}
        loading={loadingListDB}
      >
        <List
          dataSource={listDB}
          renderItem={(db, index) => (
            <ListDBItem
              db={db}
              key={index}
              setListDB={setListDB}
              setLoadingRestore={setLoadingRestore}
              loadingRestore={loadingRestore}
              restoringVersion={restoringVersion}
              setRestoringVersion={setRestoringVersion}
            />
          )}
        />
      </Card>
    </Space>
  )
}
