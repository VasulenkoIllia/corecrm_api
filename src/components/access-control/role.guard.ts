import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/db/prisma.service';
import { Reflector } from '@nestjs/core';
import { ACCESS_CONTROL_METADATA } from '../../common/decorators/access-control-endpoint.decorator';


@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private reflector: Reflector,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ){
    const request = context.switchToHttp().getRequest();
    console.log(request)
    const { requiredRole } = this.reflector.get(ACCESS_CONTROL_METADATA, context.getHandler()) || { accessOptions: {} };
    const user = request.user;

    if (!user || !user.id) {
      throw new ForbiddenException('User not provided');
    }

    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { role: true },
    });

    if (!dbUser || dbUser.role?.name !== requiredRole) {
      throw new ForbiddenException(`User must have ${requiredRole} role`);
    }

    return true;
  }
}
