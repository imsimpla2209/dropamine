import { Document, Schema, model, Model, Types } from 'mongoose'
import { IUser } from './User'

export interface IDepartment extends Document {
  name: string,
  users: IUser['_id'][],
  qacGmails: string[]
}

const departmentSchema = new Schema<IDepartment>(
  {
    name: String,
    users: [{ type: Types.ObjectId, ref: 'User' }],
    qacGmails: [{ type: String, required: false, default: []}] 
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)

const Department: Model<IDepartment> = model<IDepartment>('Department', departmentSchema)

export default Department
