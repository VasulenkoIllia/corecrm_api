import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/db/prisma.service';
import { AccessOptions } from '../../common/interfaces/user/access-options.interface';

@Injectable()
export class AccessControlService {
  private readonly logger = new Logger(AccessControlService.name);

  constructor(private prisma: PrismaService) {}

  async checkAccess(userId: number, companyId: number, options: AccessOptions) {
    this.logger.log(`Starting access check for user ${userId}, company ${companyId}, options: ${JSON.stringify(options)}`);
    try {
      this.logger.log(`Fetching company with ID ${companyId}`);
      const company = await this.prisma.company.findUnique({
        where: { id: companyId },
        include: { users: { where: { userId } } },
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

      this.logger.log(`Checking company status: ${company.status}`);
      if (company.status === 'blocked') {
        this.logger.warn(`Company ${companyId} is blocked`);
        throw new ForbiddenException('Company is blocked');
      }

      this.logger.log(`Checking subscription status: ${company.subscriptionStatus}`);
      if (company.subscriptionStatus === 'expired') {
        this.logger.warn(`Company ${companyId} subscription expired`);
        throw new ForbiddenException('Company subscription expired');
      }

      this.logger.log(`Checking module: ${options.module}`);
      if (options.module) {
        const validModules = ['clients', 'cars', 'invoices', 'reports'];
        if (!validModules.includes(options.module)) {
          this.logger.warn(`Invalid module: ${options.module}`);
          throw new ForbiddenException(`Invalid module: ${options.module}`);
        }
        this.logger.log(`Company modules: ${JSON.stringify(company.modules)}`);
        if (!company.modules || typeof company.modules !== 'object') {
          this.logger.warn(`Invalid modules format for company ${companyId}`);
          throw new ForbiddenException('Invalid modules configuration');
        }
        if (!company.modules[options.module]) {
          this.logger.warn(`${options.module} module is disabled for company ${companyId}`);
          throw new ForbiddenException(`${options.module} module is disabled`);
        }
      }

      this.logger.log(`Checking required role: ${options.requiredRole}`);
      if (options.requiredRole) {
        this.logger.log(`Fetching user with ID ${userId}`);
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          include: { role: true },
        });

        this.logger.log(`User data: ${JSON.stringify(user)}`);

        if (!user) {
          this.logger.warn(`User ${userId} not found`);
          throw new NotFoundException('User not found');
        }
        if (!user.role) {
          this.logger.warn(`User ${userId} has no role assigned`);
          throw new ForbiddenException('User has no role assigned');
        }
        if (user.role.name !== options.requiredRole) {
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
