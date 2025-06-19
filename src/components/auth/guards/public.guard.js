"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Public = exports.IS_PUBLIC_KEY = void 0;
// public.guard.ts
var common_1 = require("@nestjs/common");
exports.IS_PUBLIC_KEY = 'isPublic';
/**
 * Декоратор, який позначає ендпоінт як публічний, доступний без аутентифікації.
 * Використовується разом з JwtGuard для обходу перевірки JWT токена.
 *
 * @returns Декоратор метаданих, який встановлює прапорець isPublic у true
 */
var Public = function () { return (0, common_1.SetMetadata)(exports.IS_PUBLIC_KEY, true); };
exports.Public = Public;
