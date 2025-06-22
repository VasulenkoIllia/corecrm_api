import { Body, Controller, HttpCode, HttpStatus, Logger, Param, ParseIntPipe, RequestMethod } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AccessControlEndpoint } from '../../common/decorators/access-control-endpoint.decorator';
import { CatchError } from '../../common/decorators/catch-error.decorator';
import { User } from '../../common/decorators/user.decorator';
import { IJwtPayload } from '../../common/interfaces/common/jwt-payload.interface';
import { ClientsService } from './clients.service';
import { CreateClientDto } from '../../common/dto/client/create-client.dto';
import { ClientResponseDto } from '../../common/dto/client/client-response.dto';
import { UpdateClientDto } from '../../common/dto/client/update-client.dto';

@ApiTags('Clients')
@Controller('clients')
export class ClientsController {
  private readonly logger = new Logger(ClientsController.name);

  constructor(private readonly clientsService: ClientsService) {}

  @AccessControlEndpoint('create', { module: 'clients', action: 'create' })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Створити нового клієнта' })
  @ApiOkResponse({
    status: 201,
    description: 'Клієнт успішно створено',
    type: ClientResponseDto,
  })
  @ApiBody({
    type: CreateClientDto,
    examples: {
      example1: {
        summary: 'Приклад створення клієнта',
        value: {
          firstName: 'John',
          lastName: 'Doe',
          phone: '+380123456789',
          email: 'john.doe@example.com',
          companyId: 1,
        },
      },
    },
  })
  @CatchError('Створення клієнта')
  async createClient(@Body() createClientDto: CreateClientDto, @User() user: IJwtPayload) {
    this.logger.log(`Creating client for company ${createClientDto.companyId} by user ${user.id}`);
    return this.clientsService.createClient(createClientDto, user.id);
  }
  @AccessControlEndpoint('get', { module: 'clients', action: 'read' }, RequestMethod.GET)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Отримати список клієнтів компанії' })
  @ApiOkResponse({
    status: 200,
    description: 'Список клієнтів',
    type: [ClientResponseDto],
  })
  @CatchError('Отримання клієнтів')
  async getClients(@User() user: IJwtPayload) {
    this.logger.log(`Fetching clients for company ${user.companyId} by user ${user.id}`);
    return this.clientsService.getClients(user.companyId, user.id);
  }

  @AccessControlEndpoint(':id', { module: 'clients', action: 'read' })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Отримати клієнта за ID' })
  @ApiOkResponse({
    status: 200,
    description: 'Дані клієнта',
    type: ClientResponseDto,
  })
  @ApiParam({ name: 'id', description: 'ID клієнта', type: Number })
  @CatchError('Отримання клієнта')
  async getClientById(@Param('id', ParseIntPipe) id: number, @User() user: IJwtPayload) {
    this.logger.log(`Fetching client ${id} for company ${user.companyId} by user ${user.id}`);
    return this.clientsService.getClientById(id, user.companyId, user.id);
  }

  @AccessControlEndpoint(':id', { module: 'clients', action: 'update' })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Оновити дані клієнта' })
  @ApiOkResponse({
    status: 200,
    description: 'Клієнт оновлено',
    type: ClientResponseDto,
  })
  @ApiParam({ name: 'id', description: 'ID клієнта', type: Number })
  @ApiBody({
    type: UpdateClientDto,
    examples: {
      example1: {
        summary: 'Приклад оновлення клієнта',
        value: {
          firstName: 'John',
          lastName: 'Smith',
          phone: '+380987654321',
          email: 'john.smith@example.com',
        },
      },
    },
  })
  @CatchError('Оновлення клієнта')
  async updateClient(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientDto: UpdateClientDto,
    @User() user: IJwtPayload,
  ) {
    this.logger.log(`Updating client ${id} for company ${user.companyId} by user ${user.id}`);
    return this.clientsService.updateClient(id, updateClientDto, user.companyId, user.id);
  }

  @AccessControlEndpoint(':id', { module: 'clients', action: 'delete' })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Видалити клієнта' })
  @ApiOkResponse({
    status: 200,
    description: 'Клієнт видалено',
    schema: { properties: { message: { type: 'string', example: 'Client deleted' } } },
  })
  @ApiParam({ name: 'id', description: 'ID клієнта', type: Number })
  @CatchError('Видалення клієнта')
  async deleteClient(@Param('id', ParseIntPipe) id: number, @User() user: IJwtPayload) {
    this.logger.log(`Deleting client ${id} for company ${user.companyId} by user ${user.id}`);
    return this.clientsService.deleteClient(id, user.companyId, user.id);
  }
}
