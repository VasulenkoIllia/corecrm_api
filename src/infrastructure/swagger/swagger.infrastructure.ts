import { Injectable, Logger } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common/interfaces';
import { AppConfig } from '../app-config/app-config.infrastructure';

// Константи для тегів Swagger
const SWAGGER_TAGS = [
  { name: 'Auth', description: 'Endpoints for user authentication and authorization' },
  { name: 'Invitation', description: 'Endpoints for managing employee invitations' },
  { name: 'Modules', description: 'Endpoints for managing company modules' },
  { name: 'User', description: 'Endpoints for managing user profiles' },
  { name: 'Roles', description: 'Endpoints for managing user roles and permissions' },
  { name: 'Clients', description: 'Endpoints for managing client data' },
  { name: 'Cars', description: 'Endpoints for managing car information' },
  { name: 'Services', description: 'Endpoints for managing service offerings' },
  { name: 'Templates', description: 'Endpoints for managing document templates' },
  { name: 'Orders', description: 'Endpoints for managing customer orders' },
  { name: 'Stock', description: 'Endpoints for managing inventory stock' },
  { name: 'Documents', description: 'Endpoints for managing documents' },
];

/**
 * Сервіс для налаштування Swagger-документації API
 */
@Injectable()
export class SwaggerInfrastructure {
  private readonly logger = new Logger(SwaggerInfrastructure.name);
  private readonly swaggerUrl = '/api/docs'; // UI available at /v1/api/docs due to global prefix
  private readonly swaggerJsonUrl = '/api/docs-json'; // JSON available at /v1/api/docs-json

  constructor(private readonly appConfig: AppConfig) {}

  /**
   * Ініціалізує Swagger-документацію для додатку
   */
  public initialize(app: INestApplication): void {
    if (this.appConfig.NODE_ENV === 'production' && !this.appConfig.SWAGGER_ENABLED) {
      this.logger.warn({
        message: 'Swagger is disabled in production environment',
        method: 'initialize',
      });
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
          tryItOutEnabled: true,
          displayOperationId: true,
          defaultModelsExpandDepth: 5,
          defaultModelExpandDepth: 5,
          urls: [{ url: this.swaggerJsonUrl, name: 'API' }],
        },
        customSiteTitle: this.appConfig.SWAGGER_TITLE,
      });

      this.logger.log({
        message: 'Swagger initialized successfully',
        swaggerUrl: this.swaggerUrl,
        swaggerJsonUrl: this.swaggerJsonUrl,
        method: 'initialize',
      });
    } catch (error) {
      this.logger.error({
        message: `Failed to initialize Swagger: ${error.message}`,
        stack: error.stack,
        method: 'initialize',
      });
      throw error;
    }
  }

  /**
   * Створює специфікацію OpenAPI для Swagger
   */
  private getSwaggerSpecDocument(app: INestApplication): OpenAPIObject {
    const options = new DocumentBuilder()
      .setTitle(this.appConfig.SWAGGER_TITLE)
      .setDescription(this.appConfig.SWAGGER_DESCRIPTION)
      .setVersion(this.appConfig.BUILD_VERSION)
      .addServer(`${this.appConfig.BASE_SITE_URL}/v1`, 'API Server v1')
  .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'JWT token for authentication' })
  .addApiKey({ type: 'apiKey', name: 'X-API-Key', in: 'header', description: 'API key for authentication' });

// Додаємо теги з описами
SWAGGER_TAGS.forEach((tag) => {
  options.addTag(tag.name, tag.description);
});

const document = SwaggerModule.createDocument(app, options.build(), {
  operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  deepScanRoutes: true,
  extraModels: [],
});

return document;
}
}
