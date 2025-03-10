import { connect } from 'mongoose';
import logger from './logger.js';

const db_url = process.env.DB_URL || 'mongodb://localhost:27017/psgapi';

export async function connectDb() {
  return connect(db_url, {
    serverSelectionTimeoutMS: 15000,
  })
    .then(() => {
      logger.info('Database is connected');
      return true;
    })
    .catch((e) => {
      logger.error(`MongoDB connection error : ${e}`);
      return false;
    });
}
