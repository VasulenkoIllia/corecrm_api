import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { ElasticsearchIndexingService } from '../../infrastructure/elastic/elasticsearch-indexing.service';
import { AccessControlService } from '../access-control/access-control.service';
import { CreateClientDto } from '../../common/dto/client/create-client.dto';
import { SearchClientDto } from '../../common/dto/client/search-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    private prisma: PrismaService,
    private elasticsearchIndexingService: ElasticsearchIndexingService,
    private accessControlService: AccessControlService,
  ) {}

  async createClient(createClientDto: CreateClientDto, companyId: number, userId: number) {
    await this.accessControlService.checkAccess(userId, companyId, { module: 'clients' });

    if (createClientDto.phone) {
      const existingClientByPhone = await this.prisma.client.findUnique({
        where: { phone: createClientDto.phone },
      });
      if (existingClientByPhone) {
        throw new BadRequestException(`Клієнт із номером телефону ${createClientDto.phone} уже існує`);
      }
    }

    if (createClientDto.email) {
      const existingClientByEmail = await this.prisma.client.findUnique({
        where: { email: createClientDto.email },
      });
      if (existingClientByEmail) {
        throw new BadRequestException(`Клієнт із email ${createClientDto.email} уже існує`);
      }
    }

    const client = await this.prisma.client.create({
      data: {
        firstName: createClientDto.firstName,
        lastName: createClientDto.lastName,
        phone: createClientDto.phone,
        email: createClientDto.email,
        companyId,
      },
    });

    await this.elasticsearchIndexingService.indexDocument(
      'clients',
      client.id.toString(),
      {
        firstName: client.firstName,
        lastName: client.lastName,
        phone: client.phone,
        email: client.email,
        companyId,
        name_suggest: `${client.firstName} ${client.lastName}`,
      },
      {
        settings: {
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
        },
        mappings: {
          properties: {
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
          },
        },
      },
    );

    return { message: 'Клієнт створено', data: client };
  }

  async searchClients(searchClientDto: SearchClientDto, companyId: number, userId: number) {
    await this.accessControlService.checkAccess(userId, companyId, { module: 'clients' });

    const { query } = searchClientDto;
    const { results, suggestions } = await this.elasticsearchIndexingService.searchWithSuggestions(
      'clients',
      query,
      'name_suggest',
      companyId,
    );

    return { data: results, suggestions };
  }
}
