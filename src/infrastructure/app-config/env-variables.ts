import * as Joi from 'joi';

// Інтерфейс для типізації змінних середовища
export interface EnvVariables {
  NODE_ENV: 'development' | 'staging' | 'production';
  BASE_SITE_URL?: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  PORT: number;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  BCRYPT_SALT_ROUNDS: number;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  PROJECT_NAME?: string;
  REDIS_HOST?: string;
  REDIS_PORT?: number;
  SMTP_HOST?: string;
  SMTP_PORT?: number;
  SMTP_USE_SSL?: boolean;
  SMTP_USER_NAME?: string;
  SMTP_PASSWORD?: string;
  SMTP_SENDER_EMAIL?: string;
  SMTP_GMAIL_USER?: string;
  SMTP_GMAIL_PASS?: string;
  LOGGER_LEVEL_SECURITY?: string;
  LOGGER_HIDE_VALUES?: string;
  LOGGER_LEVEL?: 'error' | 'warn' | 'info' | 'debug';
  BUILD_VERSION?: string;
  TELEGRAM_API_TOKEN?: string;
  SWAGGER_TITLE?: string;
  SWAGGER_DESCRIPTION?: string;
  SWAGGER_ENABLED?: boolean;
  CORS_ORIGINS?: string;
  ELASTICSEARCH_URL?: string;
  RABBITMQ_URL?: string;
}

// Схема валідації змінних середовища за допомогою Joi
export const envValidationSchema = Joi.object<EnvVariables>({
  NODE_ENV: Joi.string().valid('development', 'staging', 'production').default('development'),
  BASE_SITE_URL: Joi.string().uri().optional(),
  DB_HOST: Joi.string().hostname().default('localhost'),
  DB_PORT: Joi.number().port().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  PORT: Joi.number().port().default(3000),
  JWT_SECRET: Joi.string().min(16).required(),
  JWT_EXPIRES_IN: Joi.string().default('1h'),
  BCRYPT_SALT_ROUNDS: Joi.number().min(4).default(10),
  ADMIN_EMAIL: Joi.string().email().required(),
  ADMIN_PASSWORD: Joi.string().min(8).required(),
  PROJECT_NAME: Joi.string().optional(),
  REDIS_HOST: Joi.string().hostname().optional(),
  REDIS_PORT: Joi.number().port().optional().default(6379),
  SMTP_HOST: Joi.string().hostname().optional(),
  SMTP_PORT: Joi.number().port().optional().default(587),
  SMTP_USE_SSL: Joi.boolean().optional().default(false),
  SMTP_USER_NAME: Joi.string().optional(),
  SMTP_PASSWORD: Joi.string().optional(),
  SMTP_SENDER_EMAIL: Joi.string().email().optional(),
  SMTP_GMAIL_USER: Joi.string().email().optional(),
  SMTP_GMAIL_PASS: Joi.string().optional(),
  LOGGER_LEVEL_SECURITY: Joi.string().optional(),
  LOGGER_HIDE_VALUES: Joi.string().optional(),
  LOGGER_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').optional().default('info'),
  BUILD_VERSION: Joi.string().optional().default('1.0.0'),
  TELEGRAM_API_TOKEN: Joi.string().optional(),
  SWAGGER_TITLE: Joi.string().optional().default('CRM STO API'),
  SWAGGER_DESCRIPTION: Joi.string().optional().default('API for managing CRM system for auto service stations'),
  SWAGGER_ENABLED: Joi.boolean().optional().default(true),
  CORS_ORIGINS: Joi.string().optional().default('http://localhost:3000'),
  ELASTICSEARCH_URL: Joi.string().uri().optional().default('http://localhost:9200'),
  RABBITMQ_URL: Joi.string().uri().optional().default('amqp://localhost:5672'),
}).unknown(true);
