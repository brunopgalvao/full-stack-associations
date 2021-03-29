const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema(
  {
    username: {
      type: String,
      lowercase: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
    },
    email: { type: String, required: true, match: /.+\@.+\..+/, unique: true },
    roles: {
      type: [String],
      enum: ['basic', 'manager', 'admin'],
      default: ['basic'],
    },
    password_digest: { type: String, required: true, select: false },
    products: [{ type: Schema.Types.ObjectId, ref: 'products' }],
  },
  { timestamps: true }
)

module.exports = mongoose.model('users', User)
