import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AccessControlModule } from '../access-control/access-control.module';
import { ElasticsearchModule } from '../../infrastructure/elastic/elasticsearch.module';

@Module({
  imports: [ElasticsearchModule, AccessControlModule],
  controllers: [ClientsController],
  providers: [
    ClientsService,
    PrismaService,
    // AccessControlService,
    // ElasticsearchIndexingService,
    // PrismaElasticsearchSyncService,
  ],
  exports: [ClientsService],
})
export class ClientsModule {}
