import mongoose from 'mongoose'
import chalk from 'chalk'
import { MONGODB_URI } from '../config.js'

// Uncomment to debug Mongoose queries
// mongoose.set('debug', true)

// This is for Model.findByIdAndUpdate method, specifically the so that { new: true} is the default
// Learn more: https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
mongoose.set('returnOriginal', false)

// Setup connection for MongoDB
// https://mongoosejs.com/docs/connections.html#connections
mongoose
  .connect(MONGODB_URI)
  .catch((error) => console.error('Error connecting to MongoDB: ', error.message))

// Listen to MongoDB events
// Learn more: https://mongoosejs.com/docs/connections.html#connection-events
mongoose.connection.on('disconnected', () => console.log(chalk.bold(`Disconnected from MongoDB!`)))

// Listen to any errors while connected to MongoDB
// Learn more: https://mongoosejs.com/docs/connections.html#error-handling
mongoose.connection.on('error', (error) => console.error(chalk.red(`MongoDB connection error: ${error}`)))

// Export the connection
export default mongoose.connection
