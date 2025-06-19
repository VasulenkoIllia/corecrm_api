import { Body, Controller, HttpCode, HttpStatus, Logger, Query, RequestMethod, SetMetadata } from '@nestjs/common';
import { ClientsService } from './clients.service';

import { ApiBody, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SecureEndpoint } from '../../common/decorators/secure-endpoint.decorator';
import { CatchError } from '../../common/decorators/catch-error.decorator';
import { User } from '../../common/decorators/user.decorator';
import { IJwtPayload } from '../../common/interfaces/common/jwt-payload.interface';
import { CreateClientDto } from '../../common/dto/client/create-client.dto';
import { SearchClientDto } from '../../common/dto/client/search-client.dto';

@ApiTags('clients')
@Controller('clients')
@SetMetadata('module', 'clients')
export class ClientsController {
  private readonly logger = new Logger(ClientsController.name);

  constructor(private readonly clientsService: ClientsService) {}

  @SecureEndpoint('', RequestMethod.POST)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Створити нового клієнта' })
  @ApiOkResponse({
    status: 201,
    description: 'Клієнт створено',
    schema: { properties: { message: { type: 'string' }, data: { type: 'object' } } }
  })
  @ApiBody({
    type: CreateClientDto,
    examples: {
      example1: {
        summary: 'Приклад створення клієнта',
        value: { firstName: 'Іван', lastName: 'Петренко', phone: '+380671234567', email: 'ivan.petrenko@example.com' },
      },
    },
  })
  @CatchError('Створення клієнта')
  async createClient(@Body() createClientDto: CreateClientDto, @User() user: IJwtPayload) {
    console.log(111);
    return this.clientsService.createClient(createClientDto, user.companyId, user.id);
  }

  @SecureEndpoint('search', RequestMethod.GET)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Пошук клієнтів через Elasticsearch' })
  @ApiOkResponse({
    status: 200,
    description: 'Список знайдених клієнтів',
    schema: { properties: { data: { type: 'array', items: { type: 'object' } } } }
  })
  @ApiQuery({ name: 'query', type: String, example: 'Іван' })
  @CatchError('Пошук клієнтів')
  async searchClients(@Query() searchClientDto: SearchClientDto, @User() user: IJwtPayload) {
    console.log(111);
    return this.clientsService.searchClients(searchClientDto, user.companyId, user.id);
  }
}
