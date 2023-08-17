import { Avatar, Card } from 'antd'
import Meta from 'antd/es/card/Meta'
import { useEffect, useState } from 'react'
import { Http } from '../../../../next/api/http'
import { formatDayTime } from '../../../../next/utils/helperFuncs'

function UserCard({ userId }) {
  const [userProfile, setUserProfile] = useState<any>(null)

  const findUser = async id => {
    await Http.get(`/api/v1/users/getProfile/${id}`)
      .then(res => setUserProfile(res.data.userInfo))
      .catch(err => setUserProfile(null))
  }
  useEffect(() => {
    if (userId) {
      findUser(userId)
    }
  }, [userId])

  if (!userProfile) return null

  return (
    <>
      <Card style={{ width: '100%', marginTop: 16 }}>
        <Meta
          avatar={<Avatar src={userProfile?.avatar} />}
          title={userProfile?.name}
          description={
            <>
              <div>
                <b>DOB: </b>
                {formatDayTime(userProfile?.birthday)}
              </div>
              <div>
                <b>Phone number: </b>
                {userProfile?.phone || 'None'}
              </div>
              <div>
                <b>Email: </b>
                {userProfile?.email}
              </div>
              <div>
                <b>Role: </b>
                {userProfile?.role}
              </div>
              <div>
                <b>Department: </b>
                {userProfile?.department?.name || 'None'}
              </div>
            </>
          }
        />
      </Card>
    </>
  )
}

export default UserCard
