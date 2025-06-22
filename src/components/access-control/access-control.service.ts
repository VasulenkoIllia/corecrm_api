import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AccessOptions } from '../../common/interfaces/user/access-options.interface';

@Injectable()
export class AccessControlService {
  private readonly logger = new Logger(AccessControlService.name);

  constructor(private prisma: PrismaService) {}

  async checkAccess(userId: number, companyId: number, options: AccessOptions) {
    this.logger.log(`Starting access check for user ${userId}, company ${companyId}, options: ${JSON.stringify(options)}`);
    try {
      // Fetch company and user association
      this.logger.log(`Fetching company with ID ${companyId}`);
      const company = await this.prisma.company.findUnique({
        where: { id: companyId },
        include: {
          users: {
            where: { userId },
            include: {
              companyRoles: {
                include: { companyRole: { include: { permissions: true } } },
              },
            },
          },
        },
      });

      this.logger.log(`Company data: ${JSON.stringify(company)}`);

      if (!company) {
        this.logger.warn(`Company ${companyId} not found`);
        throw new NotFoundException('Company not found');
      }
      if (!company.users.length) {
        this.logger.warn(`User ${userId} not associated with company ${companyId}`);
        throw new NotFoundException('User not associated with company');
      }

      // Check company status
      this.logger.log(`Checking company status: ${company.status}`);
      if (company.status === 'blocked') {
        this.logger.warn(`Company ${companyId} is blocked`);
        throw new ForbiddenException('Company is blocked');
      }

      // Check subscription status
      this.logger.log(`Checking subscription status: ${company.subscriptionStatus}`);
      if (company.subscriptionStatus === 'expired') {
        this.logger.warn(`Company ${companyId} subscription expired`);
        throw new ForbiddenException('Company subscription expired');
      }

      // Check if user has global superadmin or director role
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { role: true },
      });
      if (user?.role?.name === 'superadmin' || user?.role?.name === 'director') {
        this.logger.log(`User ${userId} is ${user.role.name}, bypassing module permission checks`);
        return true;
      }

      // Check module access
      this.logger.log(`Checking module: ${options.module}`);
      if (options.module) {
        // Перевіряємо, чи модуль існує
        const module = await this.prisma.module.findUnique({
          where: { name: options.module },
        });
        if (!module) {
          this.logger.warn(`Invalid module: ${options.module}`);
          throw new ForbiddenException(`Invalid module: ${options.module}`);
        }

        // Перевіряємо, чи модуль активовано для компанії
        const companyModule = await this.prisma.companyModules.findFirst({
          where: { companyId, moduleId: module.id },
        });
        if (!companyModule) {
          this.logger.warn(`${options.module} module is disabled for company ${companyId}`);
          throw new ForbiddenException(`${options.module} module is disabled`);
        }

        // Check module-specific permissions across all company roles
        const userCompanyRoles = company.users[0].companyRoles;
        if (!userCompanyRoles || userCompanyRoles.length === 0) {
          this.logger.warn(`User ${userId} has no company roles assigned in company ${companyId}`);
          throw new ForbiddenException('User has no company roles assigned');
        }

        let hasPermission = false;
        for (const userCompanyRole of userCompanyRoles) {
          const permission = userCompanyRole.companyRole.permissions.find(p => p.moduleId === module.id);
          if (permission) {
            if (options.action) {
              const actionMap = {
                read: permission.read,
                create: permission.create,
                update: permission.update,
                delete: permission.delete,
              };
              if (actionMap[options.action]) {
                hasPermission = true;
                break;
              }
            } else {
              hasPermission = true; // Якщо action не вказано, достатньо наявності модуля
              break;
            }
          }
        }

        if (!hasPermission) {
          this.logger.warn(`User ${userId} lacks permission for module ${options.module} across all roles`);
          throw new ForbiddenException(`User lacks permission for module ${options.module}`);
        }
      }

      // Check required role (global or company-specific)
      this.logger.log(`Checking required role: ${options.requiredRole}`);
      if (options.requiredRole) {
        const userCompanyRoles = company.users[0].companyRoles;
        const userGlobalRole = user?.role;
        const hasRequiredRole = userCompanyRoles.some(cr => cr.companyRole.name === options.requiredRole) || userGlobalRole?.name === options.requiredRole;
        if (!hasRequiredRole) {
          this.logger.warn(`User ${userId} does not have required role ${options.requiredRole}`);
          throw new ForbiddenException(`User must have ${options.requiredRole} role`);
        }
      }

      this.logger.log(`Access granted for user ${userId} to company ${companyId}`);
      return true;
    } catch (error) {
      this.logger.error(`Access check failed: ${error.message}, stack: ${error.stack}`);
      throw error;
    }
  }
}
