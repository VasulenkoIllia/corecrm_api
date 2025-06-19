import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJwtPayload } from '../interfaces/common/jwt-payload.interface';

/**
 * Декоратор для витягування даних користувача з об’єкта запиту.
 * Повертає весь об’єкт IJwtPayload або конкретне поле, якщо вказано.
 * Використовується після JwtGuard, який встановлює request.user.
 *
 * @example
 * // Повертає весь IJwtPayload
 * async someMethod(@User() user: IJwtPayload) {}
 *
 * // Повертає конкретне поле, наприклад, user.id
 * async someMethod(@User('id') userId: number) {}
 */
export const User = createParamDecorator(
  (data: keyof IJwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: IJwtPayload = request.user;

    if (!user) {
      throw new Error('Користувач не знайдений у запиті. Переконайтеся, що JwtGuard застосовано.');
    }

    return data ? user[data] : user;
  },
);
