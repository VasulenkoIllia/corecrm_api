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

/**
 * Гард для перевірки JWT токенів та захисту ендпоінтів.
 * Перевіряє наявність та валідність JWT токена в заголовку запиту.
 * Підтримує публічні ендпоінти та ендпоінти, доступні тільки для адміністраторів.
 */
@Injectable()
export class JwtGuard implements CanActivate {
  private readonly logger = new Logger(JwtGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly appConfig: AppConfig,
  ) {}

  /**
   * Перевіряє, чи має запит дійсний JWT токен для доступу до захищеного ресурсу.
   * Пропускає перевірку для публічних ендпоінтів.
   * Перевіряє структуру та валідність JWT токена.
   * Перевіряє права доступу для адміністративних ендпоінтів.
   * 
   * @param context Контекст виконання, що містить запит
   * @returns True, якщо доступ надано, інакше викидає виняток
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log(111)
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

  /**
   * Витягує JWT токен із заголовка Authorization запиту.
   * Очікує токен у форматі "Bearer [token]".
   * 
   * @param request Об'єкт запиту Express
   * @returns Токен, якщо він присутній та має правильний формат, інакше undefined
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
