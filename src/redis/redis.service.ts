import redisClient from "./redisClient";

class RedisService {
  async set(key: string, value: string, expiration?: number) {
    if (expiration) {
      await redisClient.set(key, value, {
        EX: expiration,
      });

      return;
    }

    await redisClient.set(key, value);
  }

  async get(key: string) {
    return await redisClient.get(key);
  }

  async remove(key: string) {
    await redisClient.del(key);
  }
}

export default new RedisService();
