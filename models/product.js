import mongoose from 'mongoose'
const Schema = mongoose.Schema

const Product = new Schema(
  {
    name: { type: String, required: true },
    imgURL: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    reviews: [
      {
        author: { type: String, required: true },
        rating: { type: Number, required: true },
        description: { type: String, required: true },
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true } }
)

// forEach example
// Product.virtual('rating').get(function () {
//   let totalRating = 0
//   this.reviews.forEach(review => {
//     totalRating = totalRating + review.rating
//   })
//   return totalRating / this.reviews.length
// })

Product.virtual('rating').get(function () {
  let totalRating = 0
  this.reviews.forEach(review => {
    totalRating = review.rating + totalRating
  })
  return totalRating / this.reviews.length
})

export default mongoose.model('products', Product)
