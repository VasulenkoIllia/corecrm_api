import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Prisma } from '@prisma/client';
import { RoleDto } from '../../common/dto/user/role.dto'; // Оновлено імпорт

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private prisma: PrismaService) {}

  async createUser(
    data: {
      email: string;
      password: string;
      name: string;
      roleName: string;
      companyId?: number;
      confirmationToken?: string;
      isEmailConfirmed?: boolean;
    },
    prismaClient: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    const { email, password, name, roleName, confirmationToken, isEmailConfirmed = false } = data;

    if (await this.checkUserExists(email, prismaClient)) {
      this.logger.warn(`User with email ${email} already exists`);
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = await this.findRoleByName(roleName, prismaClient);

    const user = await prismaClient.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        roleId: role.id,
        confirmationToken: confirmationToken || uuidv4(),
        isEmailConfirmed,
      },
    });

    if (data.companyId) {
      await prismaClient.companyUsers.create({
        data: {
          userId: user.id,
          companyId: data.companyId,
        },
      });
    }

    return user;
  }

  async findByEmailForAuth(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { role: true, companyUsers: { include: { company: true, companyRoles: { include: { companyRole: true } } } } },
    });
  }

  async findCompanyUser(userId: number) {
    const companyUser = await this.prisma.companyUsers.findFirst({
      where: { userId },
    });
    if (!companyUser) {
      throw new NotFoundException('User not associated with any company');
    }
    return companyUser;
  }

  async getUserRoles(userId: number): Promise<RoleDto[]> {
    const companyUsers = await this.prisma.companyUsers.findMany({
      where: { userId },
      include: { companyRoles: { include: { companyRole: { include: { permissions: true } } } } },
    });

    const roles = companyUsers.flatMap(cu =>
      cu.companyRoles.map(cr => ({
        id: cr.companyRole.id,
        name: cr.companyRole.name,
        description: cr.companyRole.description,
        companyId: cr.companyRole.companyId,
        permissions: cr.companyRole.permissions.map(p => ({
          module: p.module,
          read: p.read,
          create: p.create,
          update: p.update,
          delete: p.delete,
        })),
      }))
    );

    return roles;
  }

  async checkUserExists(email: string, prismaClient: Prisma.TransactionClient | PrismaService = this.prisma): Promise<boolean> {
    const user = await prismaClient.user.findUnique({
      where: { email },
    });
    return !!user;
  }

  async createAdminUser(email: string, password: string) {
    return this.createUser({
      email,
      password,
      name: 'Admin',
      roleName: 'superadmin',
      isEmailConfirmed: true,
    });
  }

  async findRoleByName(name: string, prismaClient: Prisma.TransactionClient | PrismaService = this.prisma) {
    const role = await prismaClient.role.findUnique({
      where: { name },
    });

    if (!role) {
      throw new NotFoundException(`Role ${name} not found`);
    }

    return role;
  }

  async findCompanyById(id: number) {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return company;
  }

  async createCompanyWithDirector(email: string, password: string, name: string, companyName: string) {
    return this.prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: { name: companyName, modules: { services: true, stock: true } },
      });

      const user = await this.createUser(
        {
          email,
          password,
          name,
          roleName: 'director',
          companyId: company.id,
          confirmationToken: uuidv4(),
        },
        tx,
      );

      return { user, company, confirmationToken: user.confirmationToken };
    });
  }

  async createEmployee(email: string, password: string, name: string, inviteToken: string) {
    const invitation = await this.validateInviteToken(inviteToken);

    if (invitation.email !== email) {
      throw new BadRequestException('Email does not match invitation');
    }

    return this.prisma.$transaction(async (tx) => {
      const user = await this.createUser(
        {
          email,
          password,
          name,
          roleName: 'employee',
          companyId: invitation.companyId,
        },
        tx,
      );

      await tx.invitations.delete({ where: { id: invitation.id } });

      return { user, company: invitation.company, confirmationToken: user.confirmationToken };
    });
  }

  async createInvitation(email: string, companyId: number, creatorId: number) {
    if (await this.checkUserExists(email)) {
      throw new BadRequestException('User with this email already exists');
    }

    const existingInvitation = await this.prisma.invitations.findFirst({
      where: { email, companyId },
    });

    if (existingInvitation) {
      throw new BadRequestException('Invitation for this email already exists');
    }

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 7 * 24 * 3600000);

    return this.prisma.invitations.create({
      data: {
        token,
        email,
        companyId,
        creatorId,
        expiresAt,
      },
    });
  }

  async validateInviteToken(token: string) {
    const invitation = await this.prisma.invitations.findUnique({
      where: { token },
      include: { company: true },
    });

    if (!invitation || invitation.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired invitation token');
    }

    return invitation;
  }

  async confirmEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { confirmationToken: token },
    });

    if (!user) {
      this.logger.warn(`Invalid confirmation token: ${token}`);
      throw new BadRequestException('Invalid or expired token');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailConfirmed: true,
        confirmationToken: null,
      },
    });

    this.logger.log(`Email confirmed for user: ${updatedUser.email}`);
    return { message: 'Email confirmed successfully' };
  }
}
