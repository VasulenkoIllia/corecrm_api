import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { AccessControlService } from './access-control.service';
import { Reflector } from '@nestjs/core';
import { ACCESS_CONTROL_METADATA } from '../../common/decorators/access-control-endpoint.decorator';


@Injectable()
export class AccessControlPipe implements PipeTransform {
  constructor(
    private accessControlService: AccessControlService,
    private reflector: Reflector,
  ) {}


  async transform(value: any, metadata: any) {
    const { accessOptions } = this.reflector.get(ACCESS_CONTROL_METADATA, metadata.handler) || { accessOptions: {} };
    const user = metadata.data?.user;

    if (!user || !user.id) {
      throw new BadRequestException('User not provided');
    }

    // Пропускаємо перевірку компанії для superadmin
    if (user.role === 'superadmin') {
      return value;
    }

    if (!user.companyId) {
      throw new BadRequestException('CompanyId not provided');
    }

    await this.accessControlService.checkAccess(user.id, user.companyId, accessOptions);

    return value;
  }
}
