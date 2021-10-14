import jwt from 'jsonwebtoken'
import { TOKEN_KEY } from '../config.js'

const isLoggedIn = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    if (jwt.verify(token, TOKEN_KEY)) {
      next()
    }
  } catch (error) {
    console.log(error)
    res.status(403).send('Unauthorized')
  }
}

export default isLoggedIn
