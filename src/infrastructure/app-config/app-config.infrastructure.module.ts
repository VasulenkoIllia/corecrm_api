import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfigProvider } from './app-config.infrastructure';
import { envValidationSchema } from './env-variables';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
      validationSchema: envValidationSchema,
      isGlobal: true, // Робимо ConfigModule глобальним
    }),
  ],
  providers: [ConfigService, appConfigProvider],
  exports: [appConfigProvider],
})
export class AppConfigInfrastructureModule {}
