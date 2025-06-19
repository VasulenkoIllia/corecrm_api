"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envValidationSchema = void 0;
var Joi = require("joi");
// Схема валідації змінних середовища за допомогою Joi
exports.envValidationSchema = Joi.object({
    BASE_SITE_URL: Joi.string().uri().optional(),
    DB_HOST: Joi.string().hostname().default('localhost'),
    DB_PORT: Joi.number().port().default(5433),
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
    REDIS_PORT: Joi.number().port().optional(),
    SMTP_HOST: Joi.string().hostname().optional(),
    SMTP_PORT: Joi.number().port().optional(),
    SMTP_USE_SSL: Joi.boolean().optional(),
    SMTP_USER_NAME: Joi.string().optional(),
    SMTP_PASSWORD: Joi.string().optional(),
    SMTP_SENDER_EMAIL: Joi.string().email().optional(),
    SMTP_GMAIL_USER: Joi.string().email().optional(),
    SMTP_GMAIL_PASS: Joi.string().optional(),
    LOGGER_LEVEL_SECURITY: Joi.string().optional(),
    LOGGER_HIDE_VALUES: Joi.string().optional(),
    LOGGER_LEVEL: Joi.string().optional(),
    BUILD_VERSION: Joi.string().optional(),
    TELEGRAM_API_TOKEN: Joi.string().optional(),
    SWAGGER_TITLE: Joi.string().optional(),
    SWAGGER_DESCRIPTION: Joi.string().optional(),
}).unknown(true);
