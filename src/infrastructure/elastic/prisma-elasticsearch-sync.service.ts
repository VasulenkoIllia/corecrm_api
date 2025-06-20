import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ElasticsearchIndexingService } from './elasticsearch-indexing.service';
import * as fs from 'fs';
import * as path from 'path';

interface IndexConfig {
  model: string;
  indexFields: string[];
  suggestFields: string[];
}

@Injectable()
export class PrismaElasticsearchSyncService implements OnModuleInit {
  private readonly logger = new Logger(PrismaElasticsearchSyncService.name);

  private readonly indexConfig: IndexConfig[] = [
    {
      model: 'Client',
      indexFields: ['firstName', 'lastName', 'phone', 'email', 'companyId'],
      suggestFields: ['firstName', 'lastName'],
    },
    {
      model: 'Car',
      indexFields: ['vin', 'make', 'model', 'clientId', 'companyId'],
      suggestFields: ['make', 'model'],
    },
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly elasticsearchIndexingService: ElasticsearchIndexingService,
  ) {}

  async onModuleInit() {
    await this.initializeIndexes();
    this.setupPrismaMiddleware();
  }

  private async initializeIndexes() {
    const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');

    const models = this.parseModelsFromSchema(schemaContent);
    for (const model of models) {
      const config = this.indexConfig.find((c) => c.model === model.name);
      if (config) {
        const indexName = model.name === 'Client' ? 'clients' : 'cars';
        const mapping = this.generateMappingForModel(model, config);

        const indexExists = await this.elasticsearchIndexingService.checkIndexExists(indexName);
        if (indexExists) {
          this.logger.log(`Deleting existing index ${indexName} to apply new mapping`);
          await this.elasticsearchIndexingService.deleteIndex(indexName);
        }

        this.logger.log(`Initializing index ${indexName} with mapping`);
        await this.elasticsearchIndexingService.indexDocument(
          indexName,
          'dummy',
          {},
          mapping,
        );
        this.logger.log(`Initialized index for model ${model.name}`);
      }
    }
  }

  private setupPrismaMiddleware() {
    this.prisma.$use(async (params, next) => {
      const result = await next(params);

      if (params.action === 'create' || params.action === 'update') {
        const model = params.model?.toLowerCase();
        const config = this.indexConfig.find((c) => c.model.toLowerCase() === model);
        if (config && ['client', 'car'].includes(model)) {
          const indexName = model === 'client' ? 'clients' : 'cars';
          const data = params.action === 'create' ? result : params.args.data;
          const indexData: Record<string, any> = {};

          config.indexFields.forEach((field) => {
            if (data[field] !== undefined) {
              indexData[field] = data[field];
            }
          });

          if (config.suggestFields.length > 0) {
            indexData.name_suggest = config.suggestFields
              .map((field) => data[field])
              .filter(Boolean)
              .join(' ');
          }

          await this.elasticsearchIndexingService.indexDocument(
            indexName,
            result.id.toString(),
            indexData,
            this.generateMappingForModel({ name: model }, config),
          );
          this.logger.log(`Indexed ${model} with id ${result.id}`);
        }
      }

      return result;
    });
  }

  private parseModelsFromSchema(schemaContent: string): { name: string }[] {
    const modelRegex = /model\s+(\w+)\s*{/g;
    const models: { name: string }[] = [];
    let match;
    while ((match = modelRegex.exec(schemaContent)) !== null) {
      models.push({ name: match[1] });
    }
    return models.filter((model) => ['Client', 'Car'].includes(model.name));
  }

  private generateMappingForModel(model: { name: string }, config: IndexConfig): Record<string, any> {
    const settings = {
      analysis: {
        analyzer: {
          autocomplete_analyzer: {
            type: 'custom',
            tokenizer: 'autocomplete',
            filter: ['lowercase'],
          },
        },
        tokenizer: {
          autocomplete: {
            type: 'edge_ngram',
            min_gram: 2,
            max_gram: 10,
            token_chars: ['letter', 'digit'],
          },
        },
      },
    };

    const mappings: Record<string, any> = {
      properties: {},
    };

    if (model.name === 'Client') {
      mappings.properties = {
        firstName: { type: 'text' },
        lastName: { type: 'text' },
        phone: { type: 'keyword' },
        email: { type: 'keyword' },
        companyId: { type: 'integer' },
        name_suggest: {
          type: 'search_as_you_type',
          analyzer: 'autocomplete_analyzer',
          search_analyzer: 'standard',
        },
      };
    } else if (model.name === 'Car') {
      mappings.properties = {
        vin: { type: 'keyword' },
        make: { type: 'text' },
        model: { type: 'text' },
        clientId: { type: 'integer' },
        companyId: { type: 'integer' },
        name_suggest: {
          type: 'search_as_you_type',
          analyzer: 'autocomplete_analyzer',
          search_analyzer: 'standard',
        },
      };
    }

    const filteredMappings: Record<string, any> = {
      settings,
      mappings: { properties: {} },
    };
    config.indexFields.forEach((field) => {
      if (mappings.properties[field]) {
        filteredMappings.mappings.properties[field] = mappings.properties[field];
      }
    });
    if (config.suggestFields.length > 0) {
      filteredMappings.mappings.properties.name_suggest = {
        type: 'search_as_you_type',
        analyzer: 'autocomplete_analyzer',
        search_analyzer: 'standard',
      };
    }

    return filteredMappings;
  }
}
