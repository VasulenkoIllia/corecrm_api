import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CreateCompanyRoleDto } from '../../common/dto/company/create-company-role.dto';
import { SetRolePermissionsDto } from '../../common/dto/company/set-role-permissions.dto';
import { AssignRoleToUserDto } from '../../common/dto/company/assign-role-to-user.dto';
import { GetCompanyRolesResponseDto } from '../../common/dto/company/get-company-roles-response.dto';

@Injectable()
export class RoleManagementService {
  constructor(private prisma: PrismaService) {}

  async createCompanyRole(data: CreateCompanyRoleDto) {
    return this.prisma.companyRole.create({
      data: {
        companyId: data.companyId,
        name: data.name,
        description: data.description,
      },
    });
  }

  async setRolePermissions(data: SetRolePermissionsDto) {
    const modulePromises = data.permissions.map(async p => {
      const module = await this.prisma.module.findUnique({
        where: { name: p.module },
      });
      if (!module) {
        throw new NotFoundException(`Module ${p.module} not found`);
      }
      return {
        roleId: data.roleId,
        moduleId: module.id,
        read: p.read,
        create: p.create,
        update: p.update,
        delete: p.delete,
      };
    });

    const permissionsData = await Promise.all(modulePromises);

    return this.prisma.companyRolePermissions.createMany({
      data: permissionsData,
    });
  }

  async assignRoleToUser(data: AssignRoleToUserDto) {
    const userCompany = await this.prisma.companyUsers.upsert({
      where: { userId_companyId: { userId: data.userId, companyId: data.companyId } },
      create: { userId: data.userId, companyId: data.companyId },
      update: {},
    });
    return this.prisma.userCompanyRoles.create({
      data: {
        userCompanyId: userCompany.id,
        companyRoleId: data.roleId,
      },
    });
  }

  async getCompanyRoles(companyId: number): Promise<GetCompanyRolesResponseDto> {
    const roles = await this.prisma.companyRole.findMany({
      where: { companyId },
      include: {
        permissions: { include: { module: true } },
      },
    });

    const response: GetCompanyRolesResponseDto = {
      roles: roles.map(role => ({
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: role.permissions.map(p => ({
          module: p.module.name,
          read: p.read,
          create: p.create,
          update: p.update,
          delete: p.delete,
        })),
      })),
    };

    return response;
  }
}
