import { applyDecorators, RequestMethod, SetMetadata, UseGuards } from '@nestjs/common';
import { Endpoint } from './endpoint.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from '../../components/auth/guards/jwt.guard';
import { AccessOptions } from '../interfaces/user/access-options.interface';
import { AccessControlGuard } from '../../components/access-control/access-control.guard';
import { RoleGuard } from '../../components/access-control/role.guard';

export const ACCESS_CONTROL_METADATA = 'access_control_metadata';

export const AccessControlEndpoint = (
  route: string,
  options: AccessOptions = {},
  httpRequestMethod: RequestMethod = RequestMethod.POST,
) => {
  const decorators = [
    ApiBearerAuth(),
    UseGuards(JwtGuard),
    Endpoint(route, httpRequestMethod),
  ];

  // Додаємо контроль доступу лише якщо options визначено
  if (Object.keys(options).length > 0) {
    decorators.push(
      SetMetadata(ACCESS_CONTROL_METADATA, { accessOptions: options }),
      UseGuards(AccessControlGuard),
    );
    if (options.requiredRole) {
      decorators.push(UseGuards(RoleGuard));
    }
  }

  return applyDecorators(...decorators);
};
