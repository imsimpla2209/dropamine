import { bcryptHash } from '../helpers/bcrypt.helper'
import { Document, Schema, model, Model, Types } from 'mongoose'
import { IDepartment } from './Department'
import { IIdea } from './Idea'
import { IComment } from './Comment'

export interface IUser extends Document {
  name: string
  token: string
  password: string
  resetPasswordToken: string
  resetPasswordDate: Date
  isActivate: boolean
  role: string
  username: string
  birthday: Date
  email: string
  avatar?: string
  phone?: string
  description?: string
  interests?: string[]
  isBanned: boolean
  department?: IDepartment['_id']
  ideas?: IIdea['_id'][]
  comments?: IComment['_id'][]
}

export const userSchema = new Schema<IUser>(
  {
    name: String,
    token: String,
    role: {
      type: String,
      enum: ['staff', 'coordinator', 'manager', 'admin'],
      default: 'staff',
    },
    isActivate: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordDate: Date,
    username: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      required: false,
      default:
        'https://images.ladbible.com/resize?type=jpeg&url=http://20.theladbiblegroup.com/s3/content/1f1749975876b1a1df3e9670a0e7c733.jpg&quality=70&width=720&aspectratio=16:9&extend=white',
    },
    email: {type: String, required: false, default: 'None'},
    birthday: { type: Date, required: false},
    phone: String,
    description: { type: String, required: false, default: 'No description' },
    department: { type: Types.ObjectId, required: false, ref: 'Department' },
    ideas: [{ type: Types.ObjectId, ref: 'Idea' }],
    comments: [{ type: Types.ObjectId, ref: 'Comment', default: [] }],
  },

  { timestamps: { createdAt: true, updatedAt: true } }
)

interface UserModel extends Model<IUser> {
  seedAdmin: any
}

userSchema.statics.seedAdmin = async () => {
  try {
    const users: IUser[] = await User.find({})
    if (users.length > 0) return
    const password = 'admin'
    const passwordHash = await bcryptHash(password)
    const newAccount = await new User({
      username: 'admin',
      name: 'Nguyen Van Yeah',
      password: passwordHash,
      role: 'admin',
      phone: '0696969669',
      birthday: '6-9-1969',
      isActivate: true,
    }).save()

    console.log(newAccount)
  } catch (error) {
    console.log(error)
  }
}

const User: UserModel = model<IUser, UserModel>('User', userSchema)

export default User
