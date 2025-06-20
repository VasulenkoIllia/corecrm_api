import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { Reflector } from '@nestjs/core';
import { ACCESS_CONTROL_METADATA } from '../../common/decorators/access-control-endpoint.decorator';

/**
 * Гард, який забезпечує контроль доступу на основі ролей для захищених ендпоінтів.
 * Перевіряє, що користувач, який робить запит, має необхідну роль для доступу до ендпоінту.
 * Працює з декоратором access-control-endpoint для отримання вимог до ролей.
 */
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private reflector: Reflector,
  ) {}

  /**
   * Визначає, чи має поточний користувач необхідну роль для доступу до ендпоінту.
   * Витягує необхідну роль з метаданих маршруту та перевіряє її відповідність призначеній ролі користувача.
   *
   * @param context Контекст виконання, що містить запит
   * @returns True, якщо користувач має необхідну роль, інакше викидає ForbiddenException
   */
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
