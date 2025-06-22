import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { RoleManagementService } from './role-management.service';
import { AccessControlEndpoint } from '../../common/decorators/access-control-endpoint.decorator';
import { CreateCompanyRoleDto } from '../../common/dto/company/create-company-role.dto';
import { SetRolePermissionsDto } from '../../common/dto/company/set-role-permissions.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetCompanyRolesResponseDto } from '../../common/dto/company/get-company-roles-response.dto';
import { CatchError } from '../../common/decorators/catch-error.decorator';
import { User } from '../../common/decorators/user.decorator';
import { IJwtPayload } from '../../common/interfaces/common/jwt-payload.interface';
import { AssignRoleToUserDto } from '../../common/dto/company/assign-role-to-user.dto';

@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleManagementService) {}

  @Post()
  @AccessControlEndpoint('/roles', { module: 'roles', action: 'create', requiredRole: 'director' })
  @ApiBody({ type: CreateCompanyRoleDto,
    examples: {
      example1: {
        summary: 'Приклад створення ролі',
        value: { companyId: '1', name: 'назва ролі', description: 'опис ролі'},
      },
    }, })
  async createRole(@Body() body: CreateCompanyRoleDto) {
    return this.roleService.createCompanyRole(body);
  }

  @Post(':id/permissions')
  @AccessControlEndpoint('/roles/:id/permissions', { module: 'roles', action: 'update', requiredRole: 'director' })
  @ApiBody({
    type: SetRolePermissionsDto,
    examples: {
      example1: {
        summary: 'Приклад встановлення дозволів для ролі',
        value: {
          roleId: 1,
          permissions: [
            {
              module: 'clients',
              read: true,
              create: false,
              update: false,
              delete: false
            }
          ]
        }
      }
    }
  })
  async setPermissions(
    @Param('id', ParseIntPipe) roleId: number,
    @Body() permissions: SetRolePermissionsDto,
  ) {
    return this.roleService.setRolePermissions({ ...permissions, roleId });
  }

  @Post('assign')
  @AccessControlEndpoint('/roles/assign', { module: 'roles', action: 'update', requiredRole: 'director' })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Призначити роль користувачу в компанії' })
  @ApiOkResponse({
    status: 200,
    description: 'Role successfully assigned to user',
    schema: {
      properties: {
        message: { type: 'string', example: 'Роль призначено' },
        data: { type: 'object', example: { userId: 7, companyId: 3, roleId: 3 } }
      }
    }
  })
  @ApiBody({
    type: AssignRoleToUserDto,
    examples: {
      example1: {
        summary: 'Приклад призначення ролі користувачу',
        value: {
          userId: 7,
          companyId: 3,
          roleId: 3
        }
      }
    }
  })
  @CatchError('Призначення ролі користувачу')
  async assignRole(
    @Body() data: AssignRoleToUserDto,
    @User() user: IJwtPayload,
  ) {
    try {
      const result = await this.roleService.assignRoleToUser(data);
      return {
        message: 'Роль призначено',
        data: { userId: data.userId, companyId: data.companyId, roleId: data.roleId },
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('company/:companyId')
  @AccessControlEndpoint('/roles/company/:companyId', { module: 'roles', action: 'read', requiredRole: 'director' })
  @ApiOkResponse({
    status: 200,
    description: 'List of company roles with permissions',
    type: GetCompanyRolesResponseDto,
  })
  async getCompanyRoles(@Param('companyId', ParseIntPipe) companyId: number) {
    return this.roleService.getCompanyRoles(companyId);
  }
}
