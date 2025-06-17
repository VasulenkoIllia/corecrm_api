import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../../infrastructure/db/prisma.service';
import { RoleService } from '../../infrastructure/db/role.service';
import { RedisService } from '../../infrastructure/redis/redis.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'default-secret'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1h') },
      }),
      inject: [ConfigService],
    }),
    MailModule
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, PrismaService, RoleService, RedisService],
  exports: [AuthService],
})
export class AuthModule {}
