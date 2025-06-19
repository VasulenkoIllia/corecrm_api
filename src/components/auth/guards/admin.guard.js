"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = exports.IS_ADMIN_KEY = void 0;
// admin.guard.ts
var common_1 = require("@nestjs/common");
exports.IS_ADMIN_KEY = 'isAdmin';
/**
 * Декоратор, який позначає ендпоінт як доступний тільки для суперадміністраторів.
 * Використовується разом з JwtGuard для обмеження доступу.
 *
 * @returns Декоратор метаданих, який встановлює прапорець isAdmin у true
 */
var Admin = function () { return (0, common_1.SetMetadata)(exports.IS_ADMIN_KEY, true); };
exports.Admin = Admin;
