import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from '../models/user.js'
import Product from '../models/product.js'

const SALT_ROUNDS = process.env.SALT_ROUNDS || 11
const TOKEN_KEY = process.env.TOKEN_KEY || 'areallylonggoodkey'

// for JWT expiration
const today = new Date()
const exp = new Date(today)
exp.setDate(today.getDate() + 30)

export const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body
    const password_digest = await bcrypt.hash(password, SALT_ROUNDS)
    const user = new User({
      username,
      email,
      password_digest,
    })

    await user.save()

    const payload = {
      id: user._id,
      username: user.username,
      email: user.email,
      exp: parseInt(exp.getTime() / 1000),
    }

    const token = jwt.sign(payload, TOKEN_KEY)
    res.status(201).json({ token })
  } catch (error) {
    console.log(error.message)
    res.status(400).json({ error: error.message })
  }
}

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email }).select(
      'username email roles password_digest'
    )
    if (await bcrypt.compare(password, user.password_digest)) {
      const payload = {
        id: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles,
        exp: parseInt(exp.getTime() / 1000),
      }

      const token = jwt.sign(payload, TOKEN_KEY)
      res.status(201).json({ token })
    } else {
      res.status(401).send('Invalid Credentials')
    }
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: error.message })
  }
}

export const verify = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const payload = jwt.verify(token, TOKEN_KEY)
    if (payload) {
      res.json(payload)
    }
  } catch (error) {
    console.log(error.message)
    res.status(401).send('Not Authorized')
  }
}

export const changePassword = async (req, res) => {}

export const getUserProducts = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const userProducts = await Product.find({ userId: user._id })
    res.json(userProducts)
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: error.message })
  }
}

export const getUserProduct = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    const userProduct = await Product.findById(req.params.productId).populate(
      'userId'
    )
    if (userProduct.userId.equals(user._id)) {
      return res.json(userProduct)
    }
    throw new Error(
      `Product ${userProduct._id} does not belong to user ${user._id}`
    )
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: error.message })
  }
}

export const createUserProduct = async (req, res) => {
  try {
    if (await User.findById(req.body.userId)) {
      const userProduct = new Product(req.body)
      await userProduct.save()
      res.status(201).json(product)
    }
    throw new Error(`User ${req.body.userId} does not exist!`)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}

export const updateUserProduct = async (req, res) => {
  try {
    if (await User.findById(req.params.id)) {
      await Product.findByIdAndUpdate(
        productId,
        req.body,
        { new: true },
        (error, product) => {
          if (error) {
            return res.status(500).json({ error: error.message })
          }
          if (!product) {
            return res.status(404).json({ message: 'Product not found!' })
          }
          res.status(200).json(product)
        }
      )
    }
    throw new Error(`User ${req.params.id} does not exist!`)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}

export const deleteUserProduct = async (req, res) => {
  try {
    if (await User.findById(req.params.id)) {
      const deleted = await Product.findByIdAndDelete(req.params.productId)
      if (deleted) {
        return res.status(200).send('Product deleted')
      }
      throw new Error(`Product ${req.params.productId} not found`)
    }
    throw new Error(`User ${req.params.id} does not exist!`)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message })
  }
}
