import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AccessControlEndpoint } from '../../common/decorators/access-control-endpoint.decorator';
import { CatchError } from '../../common/decorators/catch-error.decorator';
import { User } from '../../common/decorators/user.decorator';
import { IJwtPayload } from '../../common/interfaces/common/jwt-payload.interface';
import { ClientsService } from './clients.service';
import { CreateClientDto } from '../../common/dto/client/create-client.dto';
import { ClientResponseDto } from '../../common/dto/client/client-response.dto';
import { UpdateClientDto } from '../../common/dto/client/update-client.dto';

// Константи для модулів і дій
const MODULE_NAME = 'clients';
const ACTIONS = {
  CREATE: 'create' as const,
  READ: 'read' as const,
  UPDATE: 'update' as const,
  DELETE: 'delete' as const,
};

/**
 * Контролер для управління клієнтами
 */
@ApiTags('Clients')
@Controller('clients')
export class ClientsController {
  private readonly logger = new Logger(ClientsController.name);

  constructor(private readonly clientsService: ClientsService) {}

  /**
   * Створює нового клієнта для компанії
   */
  @Post()
  @AccessControlEndpoint('create', { module: MODULE_NAME, action: ACTIONS.CREATE })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new client' })
  @ApiOkResponse({
    status: 201,
    description: 'Client successfully created',
    type: ClientResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  @ApiBody({
    type: CreateClientDto,
    examples: {
      example1: {
        summary: 'Example of creating a client',
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
  @CatchError('Creating client')
  async createClient(@Body() createClientDto: CreateClientDto, @User() user: IJwtPayload) {
    this.logger.log({
      message: 'Creating client',
      companyId: createClientDto.companyId,
      userId: user.id,
      method: 'createClient',
    });
    return this.clientsService.createClient(createClientDto, user.id);
  }

  /**
   * Отримує список клієнтів компанії
   */
  @Get()
  @AccessControlEndpoint('get', { module: MODULE_NAME, action: ACTIONS.READ })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get list of company clients' })
  @ApiOkResponse({
    status: 200,
    description: 'List of clients retrieved successfully',
    type: [ClientResponseDto],
  })
  @ApiForbiddenResponse({ description: 'Access denied' })
  @CatchError('Fetching clients')
  async getClients(@User() user: IJwtPayload) {
    this.logger.log({
      message: 'Fetching clients',
      companyId: user.companyId,
      userId: user.id,
      method: 'getClients',
    });
    return this.clientsService.getClients(user.companyId, user.id);
  }

  /**
   * Отримує дані клієнта за ідентифікатором
   */
  @Get(':id')
  @AccessControlEndpoint(':id', { module: MODULE_NAME, action: ACTIONS.READ })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get client by ID' })
  @ApiOkResponse({
    status: 200,
    description: 'Client data retrieved successfully',
    type: ClientResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Client not found' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  @ApiParam({ name: 'id', description: 'Client ID', type: Number })
  @CatchError('Fetching client')
  async getClientById(@Param('id', ParseIntPipe) id: number, @User() user: IJwtPayload) {
    this.logger.log({
      message: 'Fetching client',
      clientId: id,
      companyId: user.companyId,
      userId: user.id,
      method: 'getClientById',
    });
    return this.clientsService.getClientById(id, user.companyId, user.id);
  }

  /**
   * Оновлює дані клієнта за ідентифікатором
   */
  @Put(':id')
  @AccessControlEndpoint(':id', { module: MODULE_NAME, action: ACTIONS.UPDATE })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update client data' })
  @ApiOkResponse({
    status: 200,
    description: 'Client updated successfully',
    type: ClientResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Client not found' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  @ApiParam({ name: 'id', description: 'Client ID', type: Number })
  @ApiBody({
    type: UpdateClientDto,
    examples: {
      example1: {
        summary: 'Example of updating a client',
        value: {
          firstName: 'John',
          lastName: 'Smith',
          phone: '+380987654321',
          email: 'john.smith@example.com',
        },
      },
    },
  })
  @CatchError('Updating client')
  async updateClient(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientDto: UpdateClientDto,
    @User() user: IJwtPayload,
  ) {
    this.logger.log({
      message: 'Updating client',
      clientId: id,
      companyId: user.companyId,
      userId: user.id,
      method: 'updateClient',
    });
    return this.clientsService.updateClient(id, updateClientDto, user.companyId, user.id);
  }

  /**
   * Видаляє клієнта за ідентифікатором
   */
  @Delete(':id')
  @AccessControlEndpoint(':id', { module: MODULE_NAME, action: ACTIONS.DELETE })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete client' })
  @ApiOkResponse({
    status: 200,
    description: 'Client deleted successfully',
    type: class DeleteResponseDto {
      message: string;
    },
  })
  @ApiNotFoundResponse({ description: 'Client not found' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  @ApiParam({ name: 'id', description: 'Client ID', type: Number })
  @CatchError('Deleting client')
  async deleteClient(@Param('id', ParseIntPipe) id: number, @User() user: IJwtPayload) {
    this.logger.log({
      message: 'Deleting client',
      clientId: id,
      companyId: user.companyId,
      userId: user.id,
      method: 'deleteClient',
    });
    return this.clientsService.deleteClient(id, user.companyId, user.id);
  }
}
