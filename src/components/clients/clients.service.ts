import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { ElasticsearchIndexingService } from '../../infrastructure/elastic/elasticsearch-indexing.service';
import { AccessControlService } from '../access-control/access-control.service';
import { CreateClientDto } from '../../common/dto/client/create-client.dto';
import { UpdateClientDto } from '../../common/dto/client/update-client.dto';
import { SearchClientDto } from '../../common/dto/client/search-client.dto';
import { ClientResponseDto } from '../../common/dto/client/client-response.dto';

/**
 * Сервіс для роботи з клієнтами
 */
@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(
    private prisma: PrismaService,
    private elasticsearchIndexingService: ElasticsearchIndexingService,
    private accessControlService: AccessControlService,
  ) {}

  /**
   * Створення нового клієнта
   */
  async createClient(createClientDto: CreateClientDto, userId: number) {
    await this.accessControlService.checkAccess(userId, createClientDto.companyId, { module: 'clients', action: 'create' });

    if (createClientDto.phone) {
      const existingClientByPhone = await this.prisma.client.findUnique({
        where: { phone: createClientDto.phone },
      });
      if (existingClientByPhone) {
        this.logger.warn(`Client with phone ${createClientDto.phone} already exists`);
        throw new BadRequestException(`Client with phone number ${createClientDto.phone} already exists`);
      }
    }

    if (createClientDto.email) {
      const existingClientByEmail = await this.prisma.client.findUnique({
        where: { email: createClientDto.email },
      });
      if (existingClientByEmail) {
        this.logger.warn(`Client with email ${createClientDto.email} already exists`);
        throw new BadRequestException(`Client with email ${createClientDto.email} already exists`);
      }
    }

    const client = await this.prisma.client.create({
      data: {
        firstName: createClientDto.firstName,
        lastName: createClientDto.lastName,
        phone: createClientDto.phone,
        email: createClientDto.email,
        companyId: createClientDto.companyId,
      },
    });

    await this.elasticsearchIndexingService.indexDocument(
      'clients',
      client.id.toString(),
      {
        id: client.id,
        firstName: client.firstName,
        lastName: client.lastName,
        phone: client.phone,
        email: client.email,
        companyId: client.companyId,
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
            id: { type: 'integer' },
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

    this.logger.log(`Client created with ID ${client.id} for company ${createClientDto.companyId}`);
    return { message: 'Client created', data: new ClientResponseDto(client) };
  }

  /**
   * Пошук клієнтів за запитом
   */
  async searchClients(searchClientDto: SearchClientDto, companyId: number, userId: number) {
    await this.accessControlService.checkAccess(userId, companyId, { module: 'clients', action: 'read' });

    const { query } = searchClientDto;
    const { results, suggestions } = await this.elasticsearchIndexingService.searchWithSuggestions(
      'clients',
      query,
      'name_suggest',
      companyId,
    );

    this.logger.log(`Fetched ${results.length} clients for company ${companyId} with query ${query}`);
    return { data: results, suggestions };
  }

  /**
   * Отримання списку клієнтів компанії
   */
  async getClients(companyId: number, userId: number) {
    await this.accessControlService.checkAccess(userId, companyId, { module: 'clients', action: 'read' });

    const clients = await this.prisma.client.findMany({
      where: { companyId },
    });

    this.logger.log(`Fetched ${clients.length} clients for company ${companyId}`);
    return clients.map(client => new ClientResponseDto(client));
  }

  /**
   * Отримання клієнта за ідентифікатором
   */
  async getClientById(id: number, companyId: number, userId: number) {
    await this.accessControlService.checkAccess(userId, companyId, { module: 'clients', action: 'read' });

    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!client || client.companyId !== companyId) {
      this.logger.warn(`Client ${id} not found or does not belong to company ${companyId}`);
      throw new NotFoundException('Client not found');
    }

    this.logger.log(`Fetched client ${id} for company ${companyId}`);
    return new ClientResponseDto(client);
  }

  /**
   * Оновлення даних клієнта
   */
  async updateClient(id: number, dto: UpdateClientDto, companyId: number, userId: number) {
    await this.accessControlService.checkAccess(userId, companyId, { module: 'clients', action: 'update' });

    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!client || client.companyId !== companyId) {
      this.logger.warn(`Client ${id} not found or does not belong to company ${companyId}`);
      throw new NotFoundException('Client not found');
    }

    if (dto.phone && dto.phone !== client.phone) {
      const existingClientByPhone = await this.prisma.client.findUnique({
        where: { phone: dto.phone },
      });
      if (existingClientByPhone) {
        this.logger.warn(`Client with phone ${dto.phone} already exists`);
        throw new BadRequestException(`Client with phone number ${dto.phone} already exists`);
      }
    }

    if (dto.email && dto.email !== client.email) {
      const existingClientByEmail = await this.prisma.client.findUnique({
        where: { email: dto.email },
      });
      if (existingClientByEmail) {
        this.logger.warn(`Client with email ${dto.email} already exists`);
        throw new BadRequestException(`Client with email ${dto.email} already exists`);
      }
    }

    const updatedClient = await this.prisma.client.update({
      where: { id },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        email: dto.email,
      },
    });

    await this.elasticsearchIndexingService.updateDocument(
      'clients',
      updatedClient.id.toString(),
      {
        id: updatedClient.id,
        firstName: updatedClient.firstName,
        lastName: updatedClient.lastName,
        phone: updatedClient.phone,
        email: updatedClient.email,
        companyId: updatedClient.companyId,
        name_suggest: `${updatedClient.firstName} ${updatedClient.lastName}`,
      },
    );

    this.logger.log(`Client ${id} updated for company ${companyId}`);
    return new ClientResponseDto(updatedClient);
  }

  /**
   * Видалення клієнта
   */
  async deleteClient(id: number, companyId: number, userId: number) {
    await this.accessControlService.checkAccess(userId, companyId, { module: 'clients', action: 'delete' });

    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!client || client.companyId !== companyId) {
      this.logger.warn(`Client ${id} not found or does not belong to company ${companyId}`);
      throw new NotFoundException('Client not found');
    }

    await this.prisma.client.delete({
      where: { id },
    });

    await this.elasticsearchIndexingService.deleteDocument('clients', id.toString());

    this.logger.log(`Client ${id} deleted for company ${companyId}`);
    return { message: 'Client deleted' };
  }
}
