import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AccessControlService } from './access-control.service';
import { Reflector } from '@nestjs/core';
import { ACCESS_CONTROL_METADATA } from '../../common/decorators/access-control-endpoint.decorator';


@Injectable()
export class AccessControlGuard  implements CanActivate {
  constructor(
    private accessControlService: AccessControlService,
    private reflector: Reflector,
  ) {}


 async canActivate(
    context: ExecutionContext,
  ){
    const request = context.switchToHttp().getRequest();
   console.log(request)
   const { accessOptions } = this.reflector.get(ACCESS_CONTROL_METADATA, context.getHandler()) || { accessOptions: {} };
    const user = request.user;
    if (!user || !user.id) {
      throw new BadRequestException('User not provided');
    }

    // Пропускаємо перевірку компанії для superadmin
    if (user.role === 'superadmin') {
      return true;
    }

    if (!user.companyId) {
      throw new BadRequestException('CompanyId not provided');
    }

    await this.accessControlService.checkAccess(user.id, user.companyId, accessOptions);
    console.log(333);
    return true;
  }
}
