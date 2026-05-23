import { createClient } from 'redis';
import logger from '../common/logger/logger';
import { ENV } from '../config/env';

const redisClient = createClient({
    url: ENV.REDIS_URL
});

redisClient.on('connect', () => {
    logger.info('Redis connected');
});

redisClient.on('error', (error) => {
    logger.error(error);
});

export default redisClient;
