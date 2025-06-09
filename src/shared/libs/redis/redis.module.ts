import { DynamicModule, Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {
  static register(config: { host: string; port: number }): DynamicModule {
    return {
      module: RedisModule,
      global: true,
      imports: [],
      providers: [
        {
          provide: 'REDIS_CONFIG',
          useValue: config,
        },
        RedisService,
      ],
      exports: [RedisService],
    };
  }
}
