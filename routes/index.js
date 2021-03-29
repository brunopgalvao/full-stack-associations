const { Router } = require('express')
const productsRoutes = require('./products')
const usersRoutes = require('./users')

const router = Router()

router.get('/', (req, res) => res.send('This is the api root!'))

router.use('/', usersRoutes)
router.use('/', productsRoutes)

module.exports = router