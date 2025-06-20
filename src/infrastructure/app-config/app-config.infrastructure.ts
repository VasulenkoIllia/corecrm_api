import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from './env-variables';

@Injectable()
export class AppConfig {
  private readonly logger = new Logger(AppConfig.name);

  constructor(private readonly configService: ConfigService<EnvVariables>) {
    this.validateRequiredEnvVariables();
  }

  public get NODE_ENV(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  public get BASE_SITE_URL(): string {
    const baseSiteUrl = this.configService.get<string>('BASE_SITE_URL');
    const port = this.configService.get<number>('PORT', 3000);
    return baseSiteUrl || `http://localhost:${port}`;
  }

public get DB_HOST(): string {
  return this.configService.get<string>('DB_HOST', 'localhost');
}

public get DB_PORT(): number {
  return this.configService.get<number>('DB_PORT', 5432);
}

public get DB_USERNAME(): string {
  return this.configService.get<string>('DB_USERNAME');
}

public get DB_PASSWORD(): string {
  return this.configService.get<string>('DB_PASSWORD');
}

public get DB_NAME(): string {
  return this.configService.get<string>('DB_NAME');
}

public get PORT(): number {
  return this.configService.get<number>('PORT', 3000);
}

public get JWT_SECRET(): string {
  return this.configService.get<string>('JWT_SECRET');
}

public get JWT_EXPIRES_IN(): string {
  return this.configService.get<string>('JWT_EXPIRES_IN', '1h');
}

public get BCRYPT_SALT_ROUNDS(): number {
  return this.configService.get<number>('BCRYPT_SALT_ROUNDS', 10);
}

public get ADMIN_EMAIL(): string {
  return this.configService.get<string>('ADMIN_EMAIL');
}

public get ADMIN_PASSWORD(): string {
  return this.configService.get<string>('ADMIN_PASSWORD');
}

public get PROJECT_NAME(): string | undefined {
  return this.configService.get<string>('PROJECT_NAME');
}

public get REDIS_HOST(): string | undefined {
  return this.configService.get<string>('REDIS_HOST');
}

public get REDIS_PORT(): number | undefined {
  return this.configService.get<number>('REDIS_PORT', 6379);
}

public get SMTP_HOST(): string | undefined {
  return this.configService.get<string>('SMTP_HOST');
}

public get SMTP_PORT(): number | undefined {
  return this.configService.get<number>('SMTP_PORT', 587);
}

public get SMTP_USE_SSL(): boolean | undefined {
  return this.configService.get<boolean>('SMTP_USE_SSL', false);
}

public get SMTP_USER_NAME(): string | undefined {
  return this.configService.get<string>('SMTP_USER_NAME');
}

public get SMTP_PASSWORD(): string | undefined {
  return this.configService.get<string>('SMTP_PASSWORD');
}

public get SMTP_SENDER_EMAIL(): string | undefined {
  return this.configService.get<string>('SMTP_SENDER_EMAIL');
}

public get SMTP_GMAIL_USER(): string | undefined {
  return this.configService.get<string>('SMTP_GMAIL_USER');
}

public get SMTP_GMAIL_PASS(): string | undefined {
  return this.configService.get<string>('SMTP_GMAIL_PASS');
}

public get LOGGER_LEVEL_SECURITY(): string | undefined {
  return this.configService.get<string>('LOGGER_LEVEL_SECURITY');
}

public get LOGGER_HIDE_VALUES(): string | undefined {
  return this.configService.get<string>('LOGGER_HIDE_VALUES');
}

public get LOGGER_LEVEL(): string | undefined {
  return this.configService.get<string>('LOGGER_LEVEL', 'info');
}

public get BUILD_VERSION(): string | undefined {
  return this.configService.get<string>('BUILD_VERSION', '1.0.0');
}

public get TELEGRAM_API_TOKEN(): string | undefined {
  return this.configService.get<string>('TELEGRAM_API_TOKEN');
}

public get SWAGGER_TITLE(): string | undefined {
  return this.configService.get<string>('SWAGGER_TITLE', 'CRM STO API');
}

public get SWAGGER_DESCRIPTION(): string | undefined {
  return this.configService.get<string>('SWAGGER_DESCRIPTION', 'API for managing CRM system for auto service stations');
}

public get SWAGGER_ENABLED(): boolean | undefined {
  return this.configService.get<boolean>('SWAGGER_ENABLED', this.NODE_ENV !== 'production');
}

public get CORS_ORIGINS(): string | undefined {
  return this.configService.get<string>('CORS_ORIGINS', 'http://localhost:3000');
}

public get ELASTICSEARCH_URL(): string | undefined {
  return this.configService.get<string>('ELASTICSEARCH_URL', 'http://localhost:9200');
}

public get RABBITMQ_URL(): string | undefined {
  return this.configService.get<string>('RABBITMQ_URL', 'amqp://localhost:5672');
}

private validateRequiredEnvVariables(): void {
  const requiredVars: (keyof EnvVariables)[] = [
  'NODE_ENV',
  'DB_HOST',
  'DB_PORT',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_NAME',
  'PORT',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'BCRYPT_SALT_ROUNDS',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
];

for (const varName of requiredVars) {
  if (this.configService.get(varName) == null) {
    this.logger.error(`Missing required environment variable: ${varName}`);
    throw new Error(`Environment variable ${varName} is not defined`);
  }
}
}
}

export const appConfigProvider = {
  provide: AppConfig,
  useFactory: (configService: ConfigService<EnvVariables>) => new AppConfig(configService),
  inject: [ConfigService],
};
