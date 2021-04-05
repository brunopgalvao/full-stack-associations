const express = require('express')
const db = require('./db/connection')
const favicon = require('serve-favicon')
const cors = require('cors')
const logger = require('morgan')
const routes = require('./routes')
const chalk = require('chalk')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())
app.use(logger('dev'))
app.use(favicon(__dirname + '/client/public/favicon.ico'))

app.use('/api', routes)

db.on('connected', () => {
  // clear terminal ascii command
  console.log('\u001B[2J')
  console.log(chalk.bold('Connected to MongoDB!'))
  app.listen(PORT, () => {
    if (process.env.NODE_ENV === 'production') {
      console.log(`Express Server running in production on port ${PORT}\n\n`)
    } else {
      console.log(chalk.bold(`Express Server running in development on: http://localhost:${PORT}`))
    }
  })
})
