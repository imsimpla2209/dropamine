import { Document, Schema, model, Model, Types } from 'mongoose'
import { IIdea } from './Idea'

export interface ISpecialEvent extends Document {
  title: string
  description?: string
  startDate: Date
  firstCloseDate: Date
  finalCloseDate: Date
  ideas?: IIdea['_id'][]
  departments?: string[]
  categories?: string[]
}

const eventSchema = new Schema<ISpecialEvent>(
  {
    title: String,
    description: String,
    startDate: Date,
    firstCloseDate: Date,
    finalCloseDate: Date,
    ideas: [{ type: Types.ObjectId, ref: 'Idea', default: [] }],
    departments: Array<String>,
    categories: Array<String>,
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)

const SpecialEvent: Model<ISpecialEvent> = model<ISpecialEvent>('SpecialEvent', eventSchema)

export default SpecialEvent
