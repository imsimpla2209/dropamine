import { Http, LOCALSTORAGE } from '../api/http'
import { useState, useCallback, useEffect } from 'react'
import { userStore } from '../view/auth/user-store'
import jwt_decode from 'jwt-decode'

let logoutTimer

export const useAuth = () => {
  const [token, setToken] = useState('')
  const [tokenVerified, setTokenVerified] = useState(false)
  const [tokenExpirationDate, setTokenExpirationDate] = useState(new Date())
  const [userId, setUserId] = useState('')
  const [role, setRole] = useState('')
  const login = useCallback((uid: any, token: any, tokenVerified: any, expirationDate?: any) => {
    setToken(token)
    setUserId(uid)
    setTokenVerified(tokenVerified)
    const expirationDateToken = new Date(new Date().getTime() + 1000 * 60 * 60)
    setTokenExpirationDate(expirationDateToken)
    const payload = jwt_decode(token)

    setRole(payload['user']['role'])
    userStore.updateState({ role: payload['user']['role'] })
    localStorage.setItem(
      LOCALSTORAGE.CREDENTIALS,
      JSON.stringify({
        userId: uid,
        token: token,
        tokenVerified: tokenVerified,
        expiration: expirationDateToken,
      })
    )
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setTokenExpirationDate(null)
    setUserId(null)
    setTokenVerified(null)
    localStorage.removeItem(LOCALSTORAGE.CREDENTIALS)
  }, [])

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate?.getTime() - new Date().getTime()
      logoutTimer = setTimeout(logout, remainingTime)
    } else {
      clearTimeout(logoutTimer)
    }
  }, [logout, token, tokenExpirationDate])

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem(LOCALSTORAGE.CREDENTIALS))
    if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
      fetchVerify(storedData?.token)
      if (storedData.tokenVerified) {
        login(storedData.userId, storedData.token, true, new Date(storedData.expiration))
      } else {
        logout()
      }
    } else {
      logout()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [login, setTokenVerified, tokenVerified])
  const fetchVerify = async (token: any) => {
    const result = await Http.post('/api/v1/auth/verifyToken', { token: token })
    if (result.data.success === false) {
      logout()
    }

    setTokenVerified(result.data.success)
  }

  return { token, login, logout, userId, tokenVerified, fetchVerify, role }
}
