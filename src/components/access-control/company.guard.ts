import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessControlService } from './access-control.service';

@Injectable()
export class CompanyAccessGuard implements CanActivate {
  constructor(
    private accessControlService: AccessControlService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const companyId = user.companyId;

    // Отримуємо module з метаданих
    const module = this.reflector.get<string>('module', context.getHandler()) ||
      this.reflector.get<string>('module', context.getClass());

    // Отримуємо action з метаданих із правильним типом
    const action = this.reflector.get<'read' | 'create' | 'update' | 'delete' | undefined>('action', context.getHandler()) ||
      this.reflector.get<'read' | 'create' | 'update' | 'delete' | undefined>('action', context.getClass());

    // Перевіряємо, чи action є допустимим, якщо він визначений
    if (action && !['read', 'create', 'update', 'delete'].includes(action)) {
      throw new BadRequestException(`Invalid action: ${action}. Must be one of: read, create, update, delete`);
    }

    return this.accessControlService.checkAccess(user.id, companyId, { module, action });
  }
}
