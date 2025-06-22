import { Injectable, Logger } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common/interfaces';
import { AppConfig } from '../app-config/app-config.infrastructure';

@Injectable()
export class SwaggerInfrastructure {
  private readonly logger = new Logger(SwaggerInfrastructure.name);
  private readonly swaggerUrl = '/api/docs'; // UI доступний за /v1/api/docs через глобальний префікс
  private readonly swaggerJsonUrl = '/api/docs-json'; // JSON доступний за /v1/api/docs-json

  constructor(private readonly appConfig: AppConfig) {}

  public initialize(app: INestApplication): void {
    if (this.appConfig.NODE_ENV === 'production' && !this.appConfig.SWAGGER_ENABLED) {
      this.logger.warn('Swagger is disabled in production environment');
      return;
    }

    try {
      const swaggerDoc = this.getSwaggerSpecDocument(app);

      SwaggerModule.setup(this.swaggerUrl, app, swaggerDoc, {
        explorer: true,
        swaggerOptions: {
          persistAuthorization: true,
          displayRequestDuration: true,
          filter: true,
          tagsSorter: 'alpha',
          operationsSorter: 'method',
          urls: [{ url: this.swaggerJsonUrl, name: 'API' }],
        },
        customSiteTitle: this.appConfig.SWAGGER_TITLE,
        customCss: `
  .swagger-ui .topbar { background-color: #2c3e50; }
.swagger-ui .scheme-container { background-color: #f5f6fa; }
`,
      });
} catch (error) {
  this.logger.error(`Failed to initialize Swagger: ${error.message}`, { stack: error.stack });
  throw error;
}
}

private getSwaggerSpecDocument(app: INestApplication): OpenAPIObject {
  const options = new DocumentBuilder()
    .setTitle(this.appConfig.SWAGGER_TITLE)
    .setDescription(this.appConfig.SWAGGER_DESCRIPTION)
    .setVersion(this.appConfig.BUILD_VERSION)
    // .addServer(`${this.appConfig.BASE_SITE_URL}/v1`, 'API Server') // Враховуємо префікс /v1
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'JWT token for authentication' })
    // .addApiKey({ type: 'apiKey', name: 'X-API-Key', in: 'header', description: 'API key for authentication' })
    .addTag('Auth', 'Authentication endpoints')
    .addTag('clients', 'Client management endpoints')
    .addTag('services', 'Service management endpoints')
    .addTag('templates', 'Template management endpoints')
    .addTag('orders', 'Order management endpoints')
    .addTag('stock', 'Stock management endpoints')
    .addTag('cars', 'Car management endpoints') // Виправлено опис
    .addTag('documents', 'Document management endpoints')
    .addTag('roles', 'Role management endpoints')
    .build();

  return SwaggerModule.createDocument(app, options, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });
}
}
