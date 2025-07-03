import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AccessControlEndpoint } from '../../common/decorators/access-control-endpoint.decorator';
import { CatchError } from '../../common/decorators/catch-error.decorator';
import { User } from '../../common/decorators/user.decorator';
import { IJwtPayload } from '../../common/interfaces/common/jwt-payload.interface';
import { ModulesService } from './modules.service';
import { UpdateModulesDto } from '../../common/dto/module/modules.dto';
import { ModuleResponseDto } from '../../common/dto/module/module-response.dto'; // Припускаю, що такий DTO існує

// Константи для модуля та дій
const MODULE_NAME = 'modules';
const ACTIONS = {
  CREATE: 'create' as const,
  READ: 'read' as const,
  UPDATE: 'update' as const,
  DELETE: 'delete' as const,
};

/**
 * Контролер для управління модулями компанії
 */
@ApiTags('Modules')
@Controller('modules')
export class ModulesController {
  private readonly logger = new Logger(ModulesController.name);

  constructor(private readonly modulesService: ModulesService) {}

  /**
   * Активує модуль для компанії
   */
  @Post(':moduleName')
  @AccessControlEndpoint(':moduleName', { module: MODULE_NAME, action: ACTIONS.CREATE, requiredRole: 'director' })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activate module for company' })
  @ApiOkResponse({
    status: 200,
    description: 'Module activated successfully',
    type: ModuleResponseDto, // Припускаю, що DTO існує
  })
  @ApiBadRequestResponse({ description: 'Invalid module name' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  @ApiParam({ name: 'moduleName', description: 'Module name (clients, cars, invoices, reports)', type: String, example: 'clients' })
  @CatchError('Activating module')
  async activateModule(@Param('moduleName') moduleName: string, @User() user: IJwtPayload) {
    this.logger.log({
      message: 'Activating module',
      moduleName,
      companyId: user.companyId,
      userId: user.id,
      method: 'activateModule',
    });
    return this.modulesService.activateModule(user.companyId, moduleName, user.id);
  }

  /**
   * Отримує список активних модулів компанії
   */
  @Get()
  @AccessControlEndpoint('', { module: MODULE_NAME, action: ACTIONS.READ })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get active company modules' })
  @ApiOkResponse({
    status: 200,
    description: 'List of active modules retrieved successfully',
    type: [ModuleResponseDto], // Припускаю, що DTO існує
  })
  @ApiForbiddenResponse({ description: 'Access denied' })
  @CatchError('Fetching modules')
  async getModules(@User() user: IJwtPayload) {
    this.logger.log({
      message: 'Fetching active modules',
      companyId: user.companyId,
      userId: user.id,
      method: 'getModules',
    });
    return this.modulesService.getModules(user.companyId, user.id);
  }

  /**
   * Оновлює модулі компанії
   */
  @Patch()
  @AccessControlEndpoint('', { module: MODULE_NAME, action: ACTIONS.UPDATE, requiredRole: 'director' })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update company modules' })
  @ApiOkResponse({
    status: 200,
    description: 'Modules updated successfully',
    type: ModuleResponseDto, // Припускаю, що DTO існує
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  @ApiBody({
    type: UpdateModulesDto,
    examples: {
      example1: {
        summary: 'Example of updating modules',
        value: {
          clients: true,
          cars: false,
          invoices: true,
          reports: false,
        },
      },
    },
  })
  @CatchError('Updating modules')
  async updateModules(@Body() modulesDto: UpdateModulesDto, @User() user: IJwtPayload) {
    this.logger.log({
      message: 'Updating modules',
      companyId: user.companyId,
      userId: user.id,
      method: 'updateModules',
    });
    return this.modulesService.updateModules(user.companyId, modulesDto, user.id);
  }

  /**
   * Деактивує модуль для компанії
   */
  @Delete(':moduleName')
  @AccessControlEndpoint(':moduleName', { module: MODULE_NAME, action: ACTIONS.DELETE, requiredRole: 'director' })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deactivate module for company' })
  @ApiOkResponse({
    status: 200,
    description: 'Module deactivated successfully',
    type: ModuleResponseDto, // Припускаю, що DTO існує
  })
  @ApiBadRequestResponse({ description: 'Invalid module name' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  @ApiParam({ name: 'moduleName', description: 'Module name (clients, cars, invoices, reports)', type: String, example: 'clients' })
  @CatchError('Deactivating module')
  async deactivateModule(@Param('moduleName') moduleName: string, @User() user: IJwtPayload) {
    this.logger.log({
      message: 'Deactivating module',
      moduleName,
      companyId: user.companyId,
      userId: user.id,
      method: 'deactivateModule',
    });
    return this.modulesService.deactivateModule(user.companyId, moduleName, user.id);
  }
}
