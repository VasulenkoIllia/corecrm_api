import { applyDecorators, RequestMethod, SetMetadata, UseGuards, UsePipes } from '@nestjs/common';
import { Endpoint } from './endpoint.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from '../../components/auth/guards/jwt.guard';
import { AccessOptions } from '../interfaces/user/access-options.interface';
import { AccessControlPipe } from '../../components/access-control/access-control.pipe';
import { RolePipe } from '../../components/access-control/role.pipe';


export const ACCESS_CONTROL_METADATA = 'access_control_metadata';

export const AccessControlEndpoint = (
  route: string,
  options: AccessOptions = {},
  httpRequestMethod: RequestMethod = RequestMethod.POST,
) => {
  const decorators = [
    ApiBearerAuth(),
    UseGuards(JwtGuard),
    UsePipes(AccessControlPipe),
    SetMetadata(ACCESS_CONTROL_METADATA, { accessOptions: options, requiredRole: options.requiredRole }),
    Endpoint(route, httpRequestMethod),
  ];

  if (options.requiredRole) {
    decorators.push(UsePipes(RolePipe));
  }

  return applyDecorators(...decorators);
};
