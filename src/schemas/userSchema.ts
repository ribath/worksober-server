import { Schema } from 'mongoose'
import User from '../interfaces/user'

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
  sex: { type: String, required: true, enum: ['male', 'female'] },
  adress1: { type: String },
  adress2: { type: String },
  member: { type: Boolean, required: true },
  profilePic: { type: Buffer, contentType: String },
  profilePicThumbnail: { type: Buffer, contentType: String }
})

export default userSchema
