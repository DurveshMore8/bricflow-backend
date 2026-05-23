import app from './app';
import logger from './common/logger/logger';
import { ENV } from './config/env';
import connectDatabase from './database/connection';
import redisClient from './redis/redisClient';

const PORT = ENV.PORT || 5000;

const startServer = async () => {
    await connectDatabase();
    await redisClient.connect();

    app.listen(PORT, () => {
        logger.info(`Server running on ${PORT}`);
    });
};

startServer();
