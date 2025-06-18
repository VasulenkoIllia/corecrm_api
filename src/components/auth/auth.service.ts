import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginResponseDTO } from '../../common/dto/user/login.response.dto';
import { IJwtPayload } from '../../common/interfaces/common/jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../infrastructure/db/prisma.service';
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
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      this.logger.warn(`Registration failed: Email ${email} already exists`);
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmationToken = uuidv4();
    const directorRole = await this.prisma.role.findUnique({ where: { name: 'director' } });
    if (!directorRole) {
      this.logger.error('Director role not found');
      throw new BadRequestException('Director role not found');
    }

    const company = await this.prisma.company.create({
      data: { name: companyName, modules: { services: true, stock: true } },
    });

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        roleId: directorRole.id,
        confirmationToken,
        isEmailConfirmed: false,
        companies: {
          create: { companyId: company.id },
        },
      },
    });

    await this.mailService.sendConfirmationEmail(email, confirmationToken);
    this.logger.log(`Company ${companyName} and director ${email} created`);
    return { message: 'Company registered, please confirm your email' };
  }

  async registerEmployee(dto: RegisterEmployeeDto) {
    const { email, password, name, inviteToken } = dto;
    const invitation = await this.prisma.invitations.findUnique({
      where: { token: inviteToken },
      include: { company: true },
    });

    if (!invitation || invitation.expiresAt < new Date()) {
      this.logger.warn(`Invalid invitation token for ${email}`);
      throw new BadRequestException('Invalid or expired invitation token');
    }

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      this.logger.warn(`Email ${email} already exists`);
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmationToken = uuidv4();
    const employeeRole = await this.prisma.role.findUnique({ where: { name: 'employee' } });
    if (!employeeRole) {
      this.logger.error('Employee role not found');
      throw new BadRequestException('Employee role not found');
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        roleId: employeeRole.id,
        confirmationToken,
        isEmailConfirmed: false,
        companies: {
          create: { companyId: invitation.companyId },
        },
      },
    });

    await this.prisma.invitations.delete({ where: { id: invitation.id } });
    await this.mailService.sendConfirmationEmail(email, confirmationToken);
    this.logger.log(`Employee ${email} registered for company ${invitation.companyId}`);
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
        const companyUser = await this.userService.findCompanyUser(user.id);
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
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true, companies: { include: { company: true } } },
    });

    if (!user) {
      this.logger.warn(`User with ID ${userId} not found`);
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role?.name ?? 'employee',
      company: user.companies[0]?.company,
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
          role: true,
          companies: { where: { companyId }, include: { company: true } },
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
      if (!director.companies.length) {
        this.logger.warn(`User ${directorId} not associated with company ${companyId}`);
        throw new UnauthorizedException('User not associated with the company');
      }

      const token = uuidv4();
      const expiresAt = new Date(Date.now() + 7 * 24 * 3600000);

      this.logger.log(`Creating invitation for ${email}`);
      const invitation = await this.prisma.invitations.create({
        data: {
          token,
          email,
          companyId,
          creatorId: directorId,
          expiresAt,
        },
        include: { company: true },
      });

      this.logger.log(`Invitation created: ${JSON.stringify(invitation)}`);
      await this.mailService.sendInvitationEmail(email, token, invitation.company?.name || 'Unknown Company');
      this.logger.log(`Invitation created for ${email} by director ${directorId}`);
      return { message: 'Invitation created', token };
    } catch (error) {
      this.logger.error(`Failed to create invitation: ${error.message}, stack: ${error.stack}`);
      throw error;
    }
  }

  async validateInvite(token: string) {
    const invitation = await this.prisma.invitations.findUnique({
      where: { token },
      include: { company: true },
    });

    if (!invitation || invitation.expiresAt < new Date()) {
      this.logger.warn(`Invalid or expired invitation token: ${token}`);
      throw new BadRequestException('Invalid or expired invitation token');
    }

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
        return null;
      }

      this.logger.log(`Token validated successfully for user ${payload.email}`);
      return payload;
    } catch (error) {
      this.logger.warn(`Token validation failed: ${error.message}`);
      return null;
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
        const companyUser = await this.userService.findCompanyUser(user.id);
        companyId = companyUser.companyId;
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

      this.logger.log(`Token refreshed successfully for user ${user.email}`);
      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      this.logger.error(`Refresh token failed: ${error.message}`);
      throw new UnauthorizedException('Token refresh failed');
    }
  }

  async confirmEmail(token: string) {
    return this.userService.confirmEmail(token);
  }
}
