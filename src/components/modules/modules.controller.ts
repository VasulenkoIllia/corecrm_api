import { Body, Controller, HttpCode, HttpStatus, Logger, Param, RequestMethod, SetMetadata } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { SecureEndpoint } from '../../common/decorators/secure-endpoint.decorator';
import { CatchError } from '../../common/decorators/catch-error.decorator';
import { User } from '../../common/decorators/user.decorator';
import { IJwtPayload } from '../../common/interfaces/common/jwt-payload.interface';
import { UpdateModulesDto } from '../../common/dto/module/modules.dto';


@ApiTags('modules')
@Controller('modules')
export class ModulesController {
  private readonly logger = new Logger(ModulesController.name);

  constructor(private readonly modulesService: ModulesService) {}

  @SecureEndpoint(':moduleName', RequestMethod.POST)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Активувати модуль для компанії' })
  @ApiOkResponse({
    status: 200,
    description: 'Module activated',
    schema: { properties: { message: { type: 'string' }, data: { type: 'object' } } }
  })
  @ApiParam({ name: 'moduleName', description: 'Назва модуля (clients, cars, invoices, reports)', example: 'clients' })
  @CatchError('Активація модуля')
  @SetMetadata('requiredRole', 'director')
  async activateModule(@Param('moduleName') moduleName: string, @User() user: IJwtPayload) {
    return this.modulesService.activateModule(user.companyId, moduleName, user.id);
  }

  @SecureEndpoint('', RequestMethod.GET)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Отримати активні модулі компанії' })
  @ApiOkResponse({
    status: 200,
    description: 'List of active modules',
    schema: { properties: { data: { type: 'object' } } }
  })
  @CatchError('Отримання модулів')
  async getModules(@User() user: IJwtPayload) {
    console.log(111);
    return this.modulesService.getModules(user.companyId, user.id);
  }

  @SecureEndpoint('', RequestMethod.PATCH)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Оновити модулі компанії' })
  @ApiOkResponse({
    status: 200,
    description: 'Modules updated',
    schema: { properties: { message: { type: 'string' }, data: { type: 'object' } } }
  })
  @ApiBody({
    type: UpdateModulesDto,
    examples: {
      example1: {
        summary: 'Приклад оновлення модулів',
        value: { clients: true, cars: false, invoices: true, reports: false },
      },
    },
  })
  @CatchError('Оновлення модулів')
  @SetMetadata('requiredRole', 'director')
  async updateModules(@Body() modulesDto: UpdateModulesDto, @User() user: IJwtPayload) {

    return this.modulesService.updateModules(user.companyId, modulesDto, user.id);
  }

  @SecureEndpoint(':moduleName', RequestMethod.DELETE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Деактивувати модуль для компанії' })
  @ApiOkResponse({
    status: 200,
    description: 'Module deactivated',
    schema: { properties: { message: { type: 'string' }, data: { type: 'object' } } }
  })
  @ApiParam({ name: 'moduleName', description: 'Назва модуля (clients, cars, invoices, reports)', example: 'clients' })
  @CatchError('Деактивація модуля')
  @SetMetadata('requiredRole', 'director')
  async deactivateModule(@Param('moduleName') moduleName: string, @User() user: IJwtPayload) {
    console.log(111);
    return this.modulesService.deactivateModule(user.companyId, moduleName, user.id);
  }
}
