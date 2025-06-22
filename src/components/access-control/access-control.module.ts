import { Module } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AccessControlService } from './access-control.service';
import { RoleManagementService } from './role-management.service';
import { RoleController } from './role.controller';

/**
 * Модуль, який забезпечує функціональність контролю доступу для додатку.
 * Експортує AccessControlService для використання в інших модулях.
 * Потребує PrismaService для доступу до бази даних.
 */
@Module({
  controllers: [RoleController],
  providers: [
    AccessControlService,
    PrismaService,RoleManagementService
  ],
  exports: [
    AccessControlService,RoleManagementService
  ],
})
export class AccessControlModule {}
