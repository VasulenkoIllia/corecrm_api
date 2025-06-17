import { Module } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/db/prisma.service';
import { AccessControlService } from './access-control.service';

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
