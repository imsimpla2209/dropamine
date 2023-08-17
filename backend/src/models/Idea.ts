import { Document, Schema, model, Model, Types } from 'mongoose'
import { ICategory } from './Category'
import { IComment } from './Comment'
import { ISpecialEvent } from './SpecialEvent'
import { IUser } from './User'
import { IHastag } from './Hastag'

export interface IIdeaMeta extends Document {
  likesCount: number
  views: number
  dislikesCount: number
}

export interface IIdea extends Document {
  publisherId: IUser['_id']
  categories?: ICategory['_id'][]
  title: string
  content: string
  files?: string[]
  meta?: IIdeaMeta
  likes?: IUser['_id'][]
  dislikes?: IUser['_id'][]
  comments?: IComment['_id'][]
  createdAt?: Date
  specialEvent: ISpecialEvent['_id']
  isAnonymous?: boolean
  hashtags?: IHastag['_id'][]
}

const ideaSchema = new Schema<IIdea>(
  {
    publisherId: { type: Types.ObjectId, ref: 'User' },
    categories: [{ type: Types.ObjectId, ref: 'Category' }],
    title: String,
    content: String,
    files: Array<string>,
    meta: {
      views: { type: Number, default: 0 },
      dislikesCount: { type: Number, default: 0 },
      likesCount: { type: Number, default: 0 }
    },
    likes: [{ type: Types.ObjectId, ref: 'User', default: [] }],
    dislikes: [{ type: Types.ObjectId, ref: 'User', default: [] }],
    comments: [{ type: Types.ObjectId, ref: 'Comment', default: [] }],
    createdAt: { type: Date, default: Date.now },
    specialEvent: { type: Types.ObjectId, ref: 'SpecialEvent', required: false },
    isAnonymous: { type: Boolean, default: false, required: false },
    hashtags: [{type: Types.ObjectId, ref: 'Hastag', required: false, default:[]}] 
  },
  { timestamps: { updatedAt: true } }
)

ideaSchema.pre("save", async function (done) {
  if (this.isModified("likes") || this.isModified("dislikes")) {
    const likesCounter = await this.get("likes");
    this.set("meta.likesCount", likesCounter.length)
    const disLikesCounter = await this.get("dislikes");
    this.set("meta.dislikesCount", disLikesCounter.length)
  }
  done();
})

const Idea: Model<IIdea> = model<IIdea>('Idea', ideaSchema)

export default Idea
