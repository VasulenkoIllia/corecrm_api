// admin.guard.ts
import { SetMetadata } from '@nestjs/common';

export const IS_ADMIN_KEY = 'isAdmin';

/**
 * Декоратор, який позначає ендпоінт як доступний тільки для суперадміністраторів.
 * Використовується разом з JwtGuard для обмеження доступу.
 * 
 * @returns Декоратор метаданих, який встановлює прапорець isAdmin у true
 */
export const Admin = () => SetMetadata(IS_ADMIN_KEY, true);
