import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginResponseDTO } from '../../common/dto/user/login.response.dto';
import { IJwtPayload } from '../../common/interfaces/common/jwt-payload.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signIn(email: string, password: string): Promise<LoginResponseDTO> {
    try {
      const user = await this.usersService.findByEmailForAuth(email);
      if (!user) {
        this.logger.warn(`Login attempt failed: User with email ${email} not found`);
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        this.logger.warn(`Login attempt failed: Invalid password for user ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      let companyId: number | undefined;
      if (user.role?.name !== 'superadmin') {
        const companyUser = await this.usersService.findCompanyUser(user.id);
        companyId = companyUser.companyId;
      }

      const payload: IJwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role?.name ?? 'employee',
        companyId,
      };

      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      if (!jwtSecret) {
        this.logger.error('JWT_SECRET is not defined in the configuration');
        throw new Error('JWT_SECRET is not configured');
      }
      const jwtExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '1h');
      const jwtRefreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');

      const accessToken = await this.jwtService.signAsync(payload, {
        secret: jwtSecret,
        expiresIn: jwtExpiresIn,
      });

      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: jwtSecret,
        expiresIn: jwtRefreshExpiresIn,
      });

      this.logger.log(`User ${email} signed in successfully`);
      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error(`Sign-in failed for ${email}: ${error.message}`);
      throw error instanceof UnauthorizedException ? error : new UnauthorizedException('Authentication failed');
    }
  }

  async validateToken(token: string): Promise<IJwtPayload | null> {
    try {
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      if (!jwtSecret) {
        this.logger.error('JWT_SECRET is not defined in the configuration');
        throw new Error('JWT_SECRET is not configured');
      }

      const payload = await this.jwtService.verifyAsync<IJwtPayload>(token, {
        secret: jwtSecret,
      });
      this.logger.log(`Token validated successfully for user ${payload.email}`);
      return payload;
    } catch (error) {
      this.logger.warn(`Token validation failed: ${error.message}`);
      return null;
    }
  }

  async refreshToken(refreshToken: string): Promise<LoginResponseDTO> {
    try {
      const payload = await this.validateToken(refreshToken);
      if (!payload) {
        this.logger.warn(`Refresh token invalid`);
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.usersService.findById(payload.id);
      if (!user) {
        this.logger.warn(`Refresh token failed: User with ID ${payload.id} not found`);
        throw new UnauthorizedException('Invalid user');
      }

      let companyId: number | undefined;
      if (user.role?.name !== 'superadmin') {
        const companyUser = await this.usersService.findCompanyUser(user.id);
        companyId = companyUser.companyId;
      }

      const newPayload: IJwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role?.name ?? 'employee',
        companyId,
      };

      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      if (!jwtSecret) {
        this.logger.error('JWT_SECRET is not defined in the configuration');
        throw new Error('JWT_SECRET is not configured');
      }
      const jwtExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '1h');

      const accessToken = await this.jwtService.signAsync(newPayload, {
        secret: jwtSecret,
        expiresIn: jwtExpiresIn,
      });

      this.logger.log(`Token refreshed successfully for user ${user.email}`);
      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error(`Refresh token failed: ${error.message}`);
      throw new UnauthorizedException('Token refresh failed');
    }
  }
}
