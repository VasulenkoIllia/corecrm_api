import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { AppConfig } from '../app-config/app-config.infrastructure';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'query' | 'info' | 'warn' | 'error'>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(private readonly appConfig: AppConfig) {
    super({
      datasourceUrl: `postgresql://${appConfig.DB_USERNAME}:${appConfig.DB_PASSWORD}@${appConfig.DB_HOST}:${appConfig.DB_PORT}/${appConfig.DB_NAME}?schema=public`,
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: appConfig.LOGGER_LEVEL as Prisma.LogLevel || 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    });

    // Логування повільних запитів (>200 мс)
    this.$on('query', (e: Prisma.QueryEvent) => {
      if (e.duration > 200) {
        this.logger.warn(`Slow query: ${e.query}, Duration: ${e.duration}ms`);
      }
    });
  }

  async onModuleInit() {
    const maxRetries = 3;
    let attempt = 1;
    while (attempt <= maxRetries) {
      try {
        await this.$connect();
        this.logger.log('Successfully connected to the database');
        break;
      } catch (error) {
        this.logger.error(
          `Failed to connect to the database (attempt ${attempt}/${maxRetries}): ${error.message}`,
        );
        if (attempt === maxRetries) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
        attempt++;
      }
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('Successfully disconnected from the database');
    } catch (error) {
      this.logger.error(`Failed to disconnect from the database: ${error.message}`);
    }
  }
}
