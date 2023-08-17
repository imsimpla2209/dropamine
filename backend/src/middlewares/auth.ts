import jwt from 'jsonwebtoken'
import ApiErrorResponse from '../utils/ApiErrorResponse'

export const authProtect = async (req: any, res: any, next: any) => {
  try {
    if (!req.headers.authorization || req.headers.authorization.slice(0, 7) !== 'Bearer ') {
      return next(new ApiErrorResponse('Invalid authentication', 400))
    }
    let tmp = req.header('Authorization')

    const token = tmp ? tmp.slice(7, tmp.length) : ''
    if (!token) {
      return next(new ApiErrorResponse('Invalid authentication', 401))
    }
    jwt.verify(token, process.env.JWT_ACCESS_SECRET!, (err: any, user: any) => {
      if (err) {
        return next(new ApiErrorResponse('Invalid authentication', 401))
      }
      req.payload = user
      next()
    })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export const authorize = roles => {
  return (req: any, res: any, next: any) => {
    if (!roles.includes(req.payload.user.role)) {
      return next(
        new ApiErrorResponse(
          `Not authorized, user role ${req.payload.user.role} is not allowed to access this route`,
          403
        )
      )
    }
    next()
  }
}
