import { Module } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AccessControlService } from './access-control.service';

/**
 * Модуль, який забезпечує функціональність контролю доступу для додатку.
 * Експортує AccessControlService для використання в інших модулях.
 * Потребує PrismaService для доступу до бази даних.
 */
@Module({
  providers: [
    AccessControlService,
    PrismaService
  ],
  exports: [
    AccessControlService
  ],
})
export class AccessControlModule {}
