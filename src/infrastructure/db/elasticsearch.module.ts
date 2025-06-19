import { Module } from '@nestjs/common';
import { ElasticsearchIndexingService } from './elasticsearch-indexing.service';
import { PrismaElasticsearchSyncService } from './prisma-elasticsearch-sync.service';
import { PrismaService } from './prisma.service';
import { elasticsearchModule } from './elasticsearch.config';

@Module({
  imports: [elasticsearchModule],
  providers: [ElasticsearchIndexingService, PrismaElasticsearchSyncService, PrismaService],
  exports: [ElasticsearchIndexingService, PrismaElasticsearchSyncService],
})
export class ElasticsearchModule {}
