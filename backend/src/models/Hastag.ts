import { Document, Schema, model, Model, Types } from 'mongoose'
import { IIdea } from './Idea'

export interface IHastag extends Document {
  name: string;
  ideas?: IIdea['_id'][]
}


const hastagSchema = new Schema<IHastag>(
  {
  name: String,
  ideas: [{ type: Types.ObjectId, ref: 'Idea', default: [] }],
  },
   { timestamps: { createdAt: true, updatedAt: true } });

const Hastag: Model<IHastag> = model<IHastag>('Hastag', hastagSchema)

export default Hastag

