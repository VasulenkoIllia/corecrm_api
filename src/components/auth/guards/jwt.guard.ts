import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IJwtPayload } from '../../../common/interfaces/common/jwt-payload.interface';
import { AppConfig } from '../../../infrastructure/app-config/app-config.infrastructure';
import { IS_PUBLIC_KEY } from './public.guard';
import { IS_ADMIN_KEY } from './admin.guard';

interface IAuthorizedRequest extends Request {
  user: IJwtPayload;
}

@Injectable()
export class JwtGuard implements CanActivate {
  private readonly logger = new Logger(JwtGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly appConfig: AppConfig,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      this.logger.debug('Public endpoint accessed, bypassing JWT validation.');
      return true;
    }

    const request = context.switchToHttp().getRequest<IAuthorizedRequest>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.warn('No JWT token provided in Authorization header.');
      throw new UnauthorizedException('Missing or invalid token');
    }

    try {
      const payload = await this.jwtService.verifyAsync<IJwtPayload>(token, {
        secret: this.appConfig.JWT_SECRET,
      });

      if (!payload.id || !payload.email || !payload.role || (!payload.companyId) && payload.role !== 'superadmin') {
        this.logger.warn('Invalid JWT payload structure.');
        throw new UnauthorizedException('Invalid token payload');
      }

      const isAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);

      if (isAdmin && payload.role !== 'superadmin') {
        this.logger.warn(`User ${payload.email} attempted to access admin-only endpoint.`);
        throw new ForbiddenException('Superadmin role required');
      }

      request.user = payload;
      this.logger.debug(`JWT validated for user ${payload.email} with role ${payload.role}`);
      return true;
    } catch (error) {
      this.logger.error(`JWT validation failed: ${error.message}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
