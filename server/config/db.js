import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }
    const connection = await mongoose.connect(process.env.MONGO_URI);
    logger.info(`MongoDB Connected: ${connection.connection.host}`);
    logger.info(`Database: ${connection.connection.name}`);
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1); //indicates an unsuccessful or abnormal termination
  }
};

export default connectDB;
