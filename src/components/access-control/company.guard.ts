import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
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

    // Отримуємо module з метаданих контролера або методу
    const module = this.reflector.get<string>('module', context.getHandler()) ||
      this.reflector.get<string>('module', context.getClass());

    return this.accessControlService.checkAccess(user.id, companyId, { module });
  }
}
