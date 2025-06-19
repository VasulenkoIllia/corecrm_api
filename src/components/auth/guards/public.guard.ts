// public.guard.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Декоратор, який позначає ендпоінт як публічний, доступний без аутентифікації.
 * Використовується разом з JwtGuard для обходу перевірки JWT токена.
 * 
 * @returns Декоратор метаданих, який встановлює прапорець isPublic у true
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
