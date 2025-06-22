import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AccessControlService } from './access-control.service';
import { Reflector } from '@nestjs/core';
import { ACCESS_CONTROL_METADATA } from '../../common/decorators/access-control-endpoint.decorator';

/**
 * Гард, який контролює доступ до ендпоінтів на основі дозволів користувача та налаштувань компанії.
 * Перевіряє, чи має користувач доступ до компанії, модулів та конкретних дій (read, create, update, delete).
 */
@Injectable()
export class AccessControlGuard implements CanActivate {
  constructor(
    private accessControlService: AccessControlService,
    private reflector: Reflector,
  ) {}

  /**
   * Визначає, чи має поточний користувач доступ до запитуваного ресурсу.
   * Витягує параметри доступу з метаданих маршруту та перевіряє дозволи.
   * Користувачі з роллю superadmin обходять перевірки компанії.
   *
   * @param context Контекст виконання, що містить запит
   * @returns True, якщо доступ надано, інакше викидає виняток
   */
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { accessOptions } = this.reflector.get(ACCESS_CONTROL_METADATA, context.getHandler()) || { accessOptions: {} };
    const user = request.user;

    if (!user || !user.id) {
      throw new BadRequestException('User not provided');
    }

    // Пропускаємо перевірку компанії для superadmin
    if (user.role?.name === 'superadmin') {
      return true;
    }

    if (!user.companyId) {
      throw new BadRequestException('CompanyId not provided');
    }

    await this.accessControlService.checkAccess(user.id, user.companyId, accessOptions);

    return true;
  }
}
