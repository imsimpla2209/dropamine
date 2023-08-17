import { createSubscription } from '../../libs/global-state-hook'

export const userStore = createSubscription({
  loading: true,
  isActivate: false,
  isBanned: false,
  role: '',
  name: '',
  _id: '',
  avatar: '',
  birthday: Date,
  email: '',
  phone: '',
  description: '',
  username: '',
  interests: [],
  department: { name: '', _id: '' },
})

export const userCredential = createSubscription({
  userId: '',
  token: '',
  isLoggedIn: false,
  login: (uid: any, token: any, tokenVerified: any, expirationDate?: any) => {},
  logout: () => {},
})
