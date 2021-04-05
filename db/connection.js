const mongoose = require('mongoose')
const chalk = require('chalk')

let MONGODB_URI =
  process.env.PROD_MONGODB ||
  'mongodb://127.0.0.1:27017/productsAssociationDatabase'

// Uncomment to debug Mongoose queries
// mongoose.set('debug', true)

// Will create indexes in MongoDB by default for faster queries
mongoose.set('useCreateIndex', true)

// This is for Model.findByIdAndUpdate method, specifically the so that { new: true} is the default
// Learn more: https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
mongoose.set('returnOriginal', false)

// Setup connection for MongoDB
// https://mongoosejs.com/docs/connections.html#connections
mongoose
  .connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .catch((error) => console.error('Error connecting to MongoDB: ', error.message))

// Listen to MongoDB events
// Learn more: https://mongoosejs.com/docs/connections.html#connection-events
mongoose.connection.on('disconnected', () => console.log(chalk.bold(`Disconnected from MongoDB!`)))

// Listen to any errors while connected to MongoDB
// Learn more: https://mongoosejs.com/docs/connections.html#error-handling
mongoose.connection.on('error', (error) => console.error(chalk.red(`MongoDB connection error: ${error}`)))

// Export the connection
module.exports = mongoose.connection
