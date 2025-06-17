import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/db/prisma.service';
import { AccessOptions } from '../../common/interfaces/user/access-options.interface';


@Injectable()
export class AccessControlService {
  constructor(private prisma: PrismaService) {}

  async checkAccess(userId: number, companyId: number, options: AccessOptions) {
    const company = await this.prisma.client.company.findUnique({
      where: { id: companyId },
      include: { users: { where: { userId } } },
    });

    if (!company || !company.users.length) {
      throw new NotFoundException('Company not found or user not associated');
    }

    if (company.status === 'blocked') {
      throw new ForbiddenException('Company is blocked');
    }

    if (company.subscriptionStatus === 'expired') {
      throw new ForbiddenException('Company subscription expired');
    }

    if (options.module && !company.modules[options.module]) {
      throw new ForbiddenException(`${options.module} module is disabled`);
    }

    if (options.requiredRole) {
      const user = await this.prisma.client.user.findUnique({
        where: { id: userId },
        include: { role: true },
      });

      if (!user || user.role?.name !== options.requiredRole) {
        throw new ForbiddenException(`User must have ${options.requiredRole} role`);
      }
    }
  }
}
