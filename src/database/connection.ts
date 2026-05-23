import mongoose from 'mongoose';
import logger from '../common/logger/logger';
import { ENV } from '../config/env';

const connectDatabase = async (): Promise<void> => {
    try {
        const mongoUri = ENV.MONGO_URI;

        if (!mongoUri) {
            throw new Error('Mongo URI missing');
        }

        await mongoose.connect(mongoUri);

        logger.info('MongoDB connected successfully');
    } catch (error) {
        logger.error(error);

        process.exit(1);
    }
};

export default connectDatabase;
