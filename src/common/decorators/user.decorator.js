"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var common_1 = require("@nestjs/common");
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
exports.User = (0, common_1.createParamDecorator)(function (data, ctx) {
    var request = ctx.switchToHttp().getRequest();
    var user = request.user;
    if (!user) {
        throw new Error('Користувач не знайдений у запиті. Переконайтеся, що JwtGuard застосовано.');
    }
    return data ? user[data] : user;
});
