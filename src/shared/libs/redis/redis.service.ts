import { Inject, Injectable } from '@nestjs/common';

import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  private redis: ReturnType<typeof createClient>;

  constructor(
    @Inject('REDIS_CONFIG')
    redisConfig: {
      host: string;
      port: number;
    },
  ) {
    createClient({
      url: `redis://${redisConfig.host}:${redisConfig.port}`,
    })
      .on('error', (err) => console.log('Redis Client Error', err))
      .connect()
      .then((connection) => {
        this.redis = connection;
      });
  }

  public async get(key: string) {
    return await this.redis.get(key);
  }

  public async set(key: string, value: string, ttl: number = 300) {
    return await this.redis.set(key, value, { EX: ttl });
  }

  public async delete(key: string) {
    return await this.redis.del(key);
  }
}
