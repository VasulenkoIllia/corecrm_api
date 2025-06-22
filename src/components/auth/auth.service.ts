import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginResponseDTO } from '../../common/dto/user/login.response.dto';
import { IJwtPayload } from '../../common/interfaces/common/jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { RedisService } from '../../infrastructure/redis/redis.service';
import { RegisterCompanyDto } from '../../common/interfaces/auth/register-company.interface';
import { RegisterEmployeeDto } from '../../common/interfaces/auth/register-employee.interface';
import { InviteDto } from '../../common/interfaces/auth/invite.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly redisService: RedisService,
  ) {}

  async registerCompany(dto: RegisterCompanyDto) {
    const { email, password, name, companyName } = dto;
    const { user, company, confirmationToken } = await this.userService.createCompanyWithDirector(email, password, name, companyName);
    await this.mailService.sendConfirmationEmail(email, confirmationToken);
    this.logger.log(`Company ${companyName} and director ${email} created`);
    return { message: 'Company registered, please confirm your email' };
  }

  async registerEmployee(dto: RegisterEmployeeDto) {
    const { email, password, name, inviteToken } = dto;
    const { user, company, confirmationToken } = await this.userService.createEmployee(email, password, name, inviteToken);
    await this.mailService.sendConfirmationEmail(email, confirmationToken);
    this.logger.log(`Employee ${email} registered for company ${company.id}`);
    return { message: 'Employee registered, please confirm your email' };
  }

  async signIn(email: string, password: string): Promise<LoginResponseDTO> {
    try {
      const user = await this.userService.findByEmailForAuth(email);
      if (!user || !user.isEmailConfirmed) {
        this.logger.warn(`Login attempt failed: ${email} not found or email not confirmed`);
        throw new UnauthorizedException('Invalid credentials or email not confirmed');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        this.logger.warn(`Login attempt failed: Invalid password for ${email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      let companyId: number | undefined;
      if (user.role?.name !== 'superadmin') {
        const companyUsers = await this.prisma.companyUsers.findMany({ where: { userId: user.id } });
        companyId = companyUsers.length > 0 ? companyUsers[0].companyId : undefined;
      }

      const payload: IJwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role?.name ?? 'employee',
        companyId,
      };

      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      if (!jwtSecret) {
        this.logger.error('JWT_SECRET is not defined');
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

      await this.redisService.set(`session:${user.id}`, accessToken, 3600);
      await this.redisService.set(`refresh:${user.id}`, refreshToken, 7 * 24 * 3600);

      this.logger.log(`User ${email} signed in successfully`);
      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error(`Sign-in failed for ${email}: ${error.message}`);
      throw error instanceof UnauthorizedException ? error : new UnauthorizedException('Authentication failed');
    }
  }

  async getMe(userId: number) {
    const user = await this.userService.findById(userId);
    if (!user) {
      this.logger.warn(`User with ID ${userId} not found`);
      throw new UnauthorizedException('User not found');
    }

    const companyUsers = user.companyUsers.map(cu => ({
      id: cu.id,
      companyId: cu.companyId,
      company: cu.company,
      companyRoles: cu.companyRoles.map(cr => ({
        id: cr.companyRole.id,
        name: cr.companyRole.name,
        description: cr.companyRole.description,
      })),
    }));

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role?.name ?? 'employee',
      companyUsers,
    };
  }

  async createInvite(dto: InviteDto, directorId: number) {
    this.logger.log(`Entering createInvite with directorId: ${directorId}`);
    this.logger.log(`Invite DTO: ${JSON.stringify(dto)}`);
    const { email, companyId } = dto;
    this.logger.log(`Creating invitation for email: ${email}, companyId: ${companyId}, type: ${typeof companyId}`);

    if (!Number.isInteger(companyId) || companyId <= 0) {
      this.logger.warn(`Invalid companyId: ${companyId}`);
      throw new BadRequestException('companyId must be a positive integer');
    }

    try {
      this.logger.log(`Checking company existence for ID ${companyId}`);
      const companyExists = await this.prisma.company.findUnique({
        where: { id: companyId },
      });
      if (!companyExists) {
        this.logger.warn(`Company ${companyId} not found`);
        throw new NotFoundException('Company not found');
      }

      this.logger.log(`Fetching director with ID ${directorId}`);
      const director = await this.prisma.user.findUnique({
        where: { id: directorId },
        include: {
          role: true, // Додано для доступу до director.role
          companyUsers: { where: { companyId }, include: { company: true, companyRoles: { include: { companyRole: true } } } },
        },
      });

      this.logger.log(`Director data: ${JSON.stringify(director)}`);

      if (!director) {
        this.logger.warn(`User ${directorId} not found`);
        throw new UnauthorizedException('User not found');
      }
      if (!director.role || director.role.name !== 'director') {
        this.logger.warn(`User ${directorId} is not a director`);
        throw new UnauthorizedException('Only directors can create invitations');
      }
      if (!director.companyUsers.length) {
        this.logger.warn(`User ${directorId} not associated with company ${companyId}`);
        throw new UnauthorizedException('User not associated with the company');
      }

      const invitation = await this.userService.createInvitation(email, companyId, directorId);
      await this.mailService.sendInvitationEmail(email, invitation.token, companyExists.name);
      this.logger.log(`Invitation created for ${email} by director ${directorId}`);
      return { message: 'Invitation created', token: invitation.token };
    } catch (error) {
      this.logger.error(`Failed to create invitation: ${error.message}, stack: ${error.stack}`);
      throw error;
    }
  }

  async validateInvite(token: string) {
    const invitation = await this.userService.validateInviteToken(token);
    this.logger.log(`Invitation token ${token} validated successfully`);
    return { email: invitation.email, company: invitation.company };
  }

  async validateToken(token: string): Promise<IJwtPayload | null> {
    try {
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      if (!jwtSecret) {
        this.logger.error('JWT_SECRET is not defined');
        throw new Error('JWT_SECRET is not configured');
      }

      const payload = await this.jwtService.verifyAsync<IJwtPayload>(token, {
        secret: jwtSecret,
      });

      const session = await this.redisService.get(`session:${payload.id}`);
      if (!session || session !== token) {
        this.logger.warn(`Invalid session token for user ${payload.email}`);
        throw new UnauthorizedException('Invalid session');
      }

      this.logger.log(`Token validated successfully for user: ${payload.email}`);
      return payload;
    } catch (error) {
      this.logger.warn(`Token validation failed: ${error.message}`);
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<LoginResponseDTO> {
    try {
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      if (!jwtSecret) {
        this.logger.error('JWT_SECRET is not defined');
        throw new Error('JWT_SECRET is not configured');
      }

      const payload = await this.jwtService.verifyAsync<IJwtPayload>(refreshToken, {
        secret: jwtSecret,
      });

      const user = await this.userService.findById(payload.id);
      if (!user) {
        this.logger.warn(`User with ID ${payload.id} not found`);
        throw new UnauthorizedException('Invalid user');
      }

      const storedRefreshToken = await this.redisService.get(`refresh:${user.id}`);
      if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
        this.logger.warn(`Invalid refresh token for user ${user.email}`);
        throw new UnauthorizedException('Invalid refresh token');
      }

      let companyId: number | undefined;
      if (user.role?.name !== 'superadmin') {
        const companyUsers = await this.prisma.companyUsers.findMany({ where: { userId: user.id } });
        companyId = companyUsers.length > 0 ? companyUsers[0].companyId : undefined;
      }

      const newPayload: IJwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role?.name ?? 'employee',
        companyId,
      };

      const jwtExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '1h');
      const jwtRefreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');

      const accessToken = await this.jwtService.signAsync(newPayload, {
        secret: jwtSecret,
        expiresIn: jwtExpiresIn,
      });

      const newRefreshToken = await this.jwtService.signAsync(newPayload, {
        secret: jwtSecret,
        expiresIn: jwtRefreshExpiresIn,
      });

      await this.redisService.set(`session:${user.id}`, accessToken, 3600);
      await this.redisService.set(`refresh:${user.id}`, newRefreshToken, 7 * 24 * 3600);

      this.logger.log(`Token refreshed successfully for user: ${user.email}`);
      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      this.logger.error(`Refresh token failed: ${error.message}`);
      throw new UnauthorizedException('Token refresh failed');
    }
  }

  async confirmEmail(token: string) {
    return this.userService.confirmEmail(token);
  }

  async requestPasswordReset(email: string): Promise<{ message: string }> {
    this.logger.log(`Initiating password reset for email: ${email}`);
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      this.logger.warn(`User with email ${email} not found`);
      throw new NotFoundException('User not found');
    }

    const resetToken = uuidv4();
    const resetTokenExpires = new Date(Date.now() + 3600 * 1000); // 1 hour

    await this.prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpires },
    });

    await this.mailService.sendPasswordResetEmail(email, resetToken);
    this.logger.log(`Password reset email sent to ${email}`);
    return { message: 'Password reset email sent successfully' };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    this.logger.log(`Attempting password reset with token: ${token}`);
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: { gt: new Date() },
      },
    });

    if (!user) {
      this.logger.warn(`Invalid or expired reset token: ${token}`);
      throw new BadRequestException('Invalid or expired token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    this.logger.log(`Password reset successfully for user ID: ${user.id}`);
    return { message: 'Password reset successfully' };
  }
}
