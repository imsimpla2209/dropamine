import { Document, Schema, model, Model, Types } from 'mongoose'
import { IIdea } from './Idea'

export interface ICategory extends Document {
  name: string
  ideas?: IIdea['_id'][]
}

const categorySchema = new Schema<ICategory>(
  {
    name: String,
    ideas: [{ type: Types.ObjectId, ref: 'Idea', default: [] }],
  },
  { timestamps: true }
)

const Category: Model<ICategory> = model<ICategory>('Category', categorySchema)

export default Category
