import { ForbiddenException, Injectable, PipeTransform } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/db/prisma.service';
import { Reflector } from '@nestjs/core';
import { ACCESS_CONTROL_METADATA } from '../../common/decorators/access-control-endpoint.decorator';


@Injectable()
export class RolePipe implements PipeTransform {
  constructor(
    private prisma: PrismaService,
    private reflector: Reflector,
  ) {}

  async transform(value: any, metadata: any) {
    const { requiredRole } = this.reflector.get(ACCESS_CONTROL_METADATA, metadata.handler) || {};
    const user = metadata.data?.user;

    if (!user || !user.id) {
      throw new ForbiddenException('User not provided');
    }

    const dbUser = await this.prisma.client.user.findUnique({
      where: { id: user.id },
      include: { role: true },
    });

    if (!dbUser || dbUser.role?.name !== requiredRole) {
      throw new ForbiddenException(`User must have ${requiredRole} role`);
    }

    return value;
  }
}
