const express = require('express')
const db = require('./db/connection')
const favicon = require('serve-favicon')
const cors = require('cors')
const logger = require('morgan')
const routes = require('./routes')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json());
app.use(cors())
app.use(logger('dev'))
app.use(favicon(__dirname + '/client/public/favicon.ico'))

app.use('/api', routes)

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.listen(PORT, () => {
    if (process.env.NODE_ENV === 'production') {
        console.log(
          `💻  => PRODUCTION: Application running on port ${PORT}\n\n`,
        )
      } else {
        console.log(
          `💻  => Express web server application running in browser at http://localhost:${PORT}\n\n`,
        )
      }
})