import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpException, HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import helmet from 'helmet';
import compression from 'compression';
import { NextFunction, Request, Response } from 'express';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppConfig } from './infrastructure/app-config/app-config.infrastructure';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { SwaggerInfrastructure } from './infrastructure/swagger/swagger.infrastructure';

// Глобальний обробник помилок
function globalErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const logger = new Logger('GlobalErrorHandler');
  const status = err instanceof HttpException ? err.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal server error';

  logger.error(`[${req.method}] ${req.url} - ${status} - ${message}`, err.stack);

  res.status(status).json({
    statusCode: status,
    message,
    timestamp: new Date().toISOString(),
    path: req.url,
  });
}

// Логування запитів
function requestLogger(logger: Logger) {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.log(`[${req.method}] ${req.url} - ${res.statusCode} - ${duration}ms`);
    });
    next();
  };
}

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Налаштування Winston
  const winstonLogger = WinstonModule.createLogger({
    level: process.env.LOGGER_LEVEL || 'info',
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.errors({ stack: true }),
          process.env.NODE_ENV === 'development'
            ? winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ level, message, context, timestamp, stack, ...meta }) => {
                  const metaString = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
                  return stack
                    ? `${timestamp} [${context || 'App'}] ${level}: ${message}\n${stack}${metaString}`
                    : `${timestamp} [${context || 'App'}] ${level}: ${message}${metaString}`;
                }),
              )
            : winston.format.json(),
        ),
      }),
    ],
  });

  // Створення додатку з типом NestExpressApplication
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // logger: winstonLogger,
  });

  // Отримання конфігурації та сервісів
  const appConfig = app.get(AppConfig);
  const httpExceptionFilter = app.get(HttpExceptionFilter);

  // Налаштування безпеки
  app.use(helmet());
  app.use(compression());
  app.enableCors({
    origin: appConfig.CORS_ORIGINS.split(','),
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // Глобальні пайпи для валідації
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  // Глобальний обробник помилок
  app.useGlobalFilters(httpExceptionFilter);
  app.use(globalErrorHandler);

  // Логування запитів
  app.use(requestLogger(new Logger('Request')));

  // API версіонування
  app.setGlobalPrefix('api');

  // Serve static files (e.g., theme-toggle.js)
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/static/',
  });

  // Ініціалізація Swagger
  const swagger = app.get(SwaggerInfrastructure);
  swagger.initialize(app);

  // Запуск сервера
  const port = appConfig.PORT;
  await app.listen(port);
  logger.log(`Application is running on: ${appConfig.BASE_SITE_URL}:${port}`);
  logger.log(`Swagger is running on: ${appConfig.BASE_SITE_URL}:${port}/api/docs`);
}

bootstrap().catch((error) => {
  console.error(`Bootstrap failed: ${error.message}`);
  process.exit(1);
});
