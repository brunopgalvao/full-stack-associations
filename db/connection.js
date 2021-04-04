const mongoose = require('mongoose')
const chalk = require('chalk')
const lines = '-'.repeat(45)

let MONGODB_URI =
  process.env.PROD_MONGODB ||
  'mongodb://127.0.0.1:27017/productsAssociationDatabase'

// mongoose.set('debug', true)
mongoose.set('useCreateIndex', true)
// This is for Model.findByIdAndUpdate method, specifically the so that { new: true} is the default
// Learn more: https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
mongoose.set('returnOriginal', false)

// Setup connection for MongoDB
// https://mongoosejs.com/docs/connections.html#connections

mongoose
  .connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .catch((error) =>
    console.error('Error connecting to MongoDB: ', error.message)
  )

// listen to MongoDB events
// Learn more: https://mongoosejs.com/docs/connections.html#connection-events
mongoose.connection.on('connected', () => {
  const date = new Date().toLocaleString()
  console.log(`\n${lines}`)
  console.log(chalk.green(`MongoDB connected on ${date}`))
  console.log(`${lines}\n`)
})

mongoose.connection.on('disconnected', () => {
  const date = new Date().toLocaleString()
  console.log(`\n${lines}`)
  console.log(chalk.green(`MongoDB disconnected on ${date}`))
  console.log(`${lines}\n`)
})

// Listen to any errors while connected to MongoDB
// Learn more: https://mongoosejs.com/docs/connections.html#error-handling
mongoose.connection.on('error', (error) => {
  const date = new Date().toLocaleString()
  console.log(`\n${lines}`)
  console.error(`There was a MongoDB connection error on ${date}`)
  console.error(chalk.red(`MongoDB connection error: ${error}`))
  console.log(`${lines}\n`)
})

module.exports = mongoose.connection
