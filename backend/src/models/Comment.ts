import { Document, Schema, model, Model, Types } from 'mongoose'
import { IIdea } from './Idea';
import { IUser } from './User';

export interface IComment extends Document {
  userId: IUser['_id'];
  ideaId: IIdea['_id'];
  content: string;
  date: Date;
  like?: Number;
  dislike?: Number;
  isAnonymous?: boolean;
}

const commentSchema: Schema = new Schema<IComment>({
  userId: { type: Types.ObjectId, ref: 'User'},
  ideaId: { type: Types.ObjectId, ref: 'Idea'},
  content: { type: String, required: true},
  date: { type: Date, default: Date.now },
  like: { type: Number, default: 0 , required: false},
  dislike: { type: Number, default: 0 , required: false},
  isAnonymous: {type: Boolean, default: false, required: false},
})

const Comment: Model<IComment> = model<IComment>('Comment', commentSchema);

export default Comment;