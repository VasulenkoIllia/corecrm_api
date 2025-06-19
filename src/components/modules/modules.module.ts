import { Module } from '@nestjs/common';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';
import { PrismaService } from '../../infrastructure/db/prisma.service';
import { AccessControlService } from '../access-control/access-control.service';


@Module({
  controllers: [ModulesController],
  providers: [ModulesService, PrismaService, AccessControlService],
  exports: [ModulesService],
})
export class ModulesModule {}
