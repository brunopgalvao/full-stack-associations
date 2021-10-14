import jwt from 'jsonwebtoken'
import { TOKEN_KEY } from '../config.js'

const isManager = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const user = jwt.verify(token, TOKEN_KEY)
    if(user.roles.includes('manager')) {
        next()
    } else {
      throw new Error('Wrong role!')
    }
  } catch (error) {
    console.log(error)
    res.status(403).send('Unauthorized')
  }
}

export default isManager
