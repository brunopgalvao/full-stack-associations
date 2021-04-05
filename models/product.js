import mongoose from 'mongoose'
const Schema = mongoose.Schema

const Product = new Schema(
  {
    name: { type: String, required: true },
    imgURL: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
  },
  { timestamps: true }
)

export default mongoose.model('products', Product)
