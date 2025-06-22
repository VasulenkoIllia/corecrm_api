// Імпорт необхідних модулів та залежностей
import { Module, Provider } from '@nestjs/common'; // Основний декоратор для створення модулів NestJS
import { UserModule } from './components/user/user.module'; // Модуль для роботи з користувачами
import { AuthModule } from './components/auth/auth.module'; // Модуль для автентифікації
import { AppConfigInfrastructureModule } from './infrastructure/app-config/app-config.infrastructure.module'; // Модуль конфігурації додатку
import { DbInfrastructureModule } from './infrastructure/db/db.infrastructure.module'; // Модуль для роботи з базою даних
import { MappingInfrastructureModule } from './infrastructure/mapping/mapping.infrastructure.module';
import { MailModule } from './components/mail/mail.module'; // Модуль для маппінгу об'єктів
import { InvitationModule } from './components/invitation/invitation.module';
import { ModulesModule } from './components/modules/modules.module';
import { ClientsModule } from './components/clients/clients.module';
import { WinstonModule } from 'nest-winston';

import { CarsModule } from './components/cars/cars.module';
import winston from 'winston';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { APP_GUARD } from '@nestjs/core';
import { SwaggerInfrastructure } from './infrastructure/swagger/swagger.infrastructure';
import { AccessControlModule } from './components/access-control/access-control.module';

const throttlerGuardProvider: Provider = {
  provide: APP_GUARD,
  useClass: ThrottlerGuard,
};

/**
 * Головний модуль додатку
 * Відповідає за конфігурацію та ініціалізацію всіх компонентів системи
 */
@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      ],
    }),
    ThrottlerModule.forRoot([{
      name: 'default',
      ttl: 60000,
      limit: 100,
    }]),
    AppConfigInfrastructureModule, // Імпорт модуля конфігурації додатку
    DbInfrastructureModule, // Імпорт модуля для роботи з базою даних
    MappingInfrastructureModule.registerProfilesAsync(), // Імпорт та реєстрація профілів маппінгу
    UserModule, // Імпорт модуля для роботи з користувачами
    AuthModule, // Імпорт модуля для автентифікації
    MailModule,
    InvitationModule,
    ModulesModule,
    ClientsModule,
    CarsModule,
    AccessControlModule
  ],
  providers: [HttpExceptionFilter, throttlerGuardProvider, SwaggerInfrastructure],
})


export class AppModule {

}
