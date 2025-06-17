import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client;

  constructor(private configService: ConfigService) {
    const redisUrl = this.configService.get<string>('REDIS_URL', 'redis://localhost:6379');
    this.client = createClient({
      url: redisUrl,
    });

    this.client.on('error', (err) => {
      this.logger.error(`Redis client error: ${err.message}`);
    });
  }

  async onModuleInit() {
    try {
      await this.client.connect();
      this.logger.log('Redis client connected');
    } catch (error) {
      this.logger.error(`Failed to connect to Redis: ${error.message}`);
    }
  }

  async onModuleDestroy() {
    try {
      await this.client.disconnect();
      this.logger.log('Redis client disconnected');
    } catch (error) {
      this.logger.error(`Failed to disconnect from Redis: ${error.message}`);
    }
  }

  async set(key: string, value: string, ttl: number) {
    try {
      await this.client.set(key, value, { EX: ttl });
      this.logger.debug(`Set key: ${key} with TTL: ${ttl}`);
    } catch (error) {
      this.logger.error(`Failed to set key ${key}: ${error.message}`);
      throw error;
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      const value = await this.client.get(key);
      this.logger.debug(`Get key: ${key}`);
      return value;
    } catch (error) {
      this.logger.error(`Failed to get key ${key}: ${error.message}`);
      throw error;
    }
  }

  async del(key: string) {
    try {
      await this.client.del(key);
      this.logger.debug(`Deleted key: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete key ${key}: ${error.message}`);
      throw error;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const exists = await this.client.exists(key);
      return exists === 1;
    } catch (error) {
      this.logger.error(`Failed to check if key ${key} exists: ${error.message}`);
      throw error;
    }
  }
}
