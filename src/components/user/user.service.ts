import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/db/prisma.service';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private prisma: PrismaService) {}

  async findByEmailForAuth(email: string) {
    return this.prisma.client.user.findUnique({
      where: { email },
      include: { role: true },
    });
  }

  async findById(id: number) {
    return this.prisma.client.user.findUnique({
      where: { id },
      include: { role: true },
    });
  }

  async findCompanyUser(userId: number) {
    const companyUser = await this.prisma.client.companyUsers.findFirst({
      where: { userId },
    });
    if (!companyUser) {
      throw new NotFoundException('User not associated with any company');
    }
    return companyUser;
  }

  async checkUserExists(email: string): Promise<boolean> {
    const user = await this.prisma.client.user.findUnique({
      where: { email },
    });
    return !!user;
  }

  async createAdminUser(email: string, password: string) {
    const userExists = await this.checkUserExists(email);
    if (userExists) {
      return; // Користувач уже існує, пропускаємо створення
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = await this.prisma.client.role.findUnique({
      where: { name: 'superadmin' },
    });

    if (!role) {
      throw new NotFoundException('Role superadmin not found');
    }

    return this.prisma.client.user.create({
      data: {
        email,
        password: hashedPassword,
        name: 'Admin',
        roleId: role.id,
        isEmailConfirmed: true, // Встановлюємо підтверджений email
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async findRoleByName(name: string) {
    const role = await this.prisma.client.role.findUnique({
      where: { name },
    });

    if (!role) {
      throw new NotFoundException(`Role ${name} not found`);
    }

    return role;
  }

  async findCompanyById(id: number) {
    const company = await this.prisma.client.company.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return company;
  }

  async createCompanyWithDirector(email: string, password: string, name: string, companyName: string) {
    const userExists = await this.checkUserExists(email);
    if (userExists) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmationToken = uuidv4();

    const role = await this.findRoleByName('director');

    return this.prisma.client.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: companyName,
        },
      });

      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          roleId: role.id,
          isEmailConfirmed: false,
          confirmationToken,
        },
      });

      await tx.companyUsers.create({
        data: {
          userId: user.id,
          companyId: company.id,
        },
      });

      return { user, company, confirmationToken };
    });
  }

  async createEmployee(email: string, password: string, name: string, inviteToken: string) {
    const userExists = await this.checkUserExists(email);
    if (userExists) {
      throw new BadRequestException('Email already exists');
    }

    const invitation = await this.prisma.client.invitations.findUnique({
      where: { token: inviteToken },
      include: { company: true },
    });

    if (!invitation) {
      throw new BadRequestException('Invalid invitation token');
    }

    if (invitation.expiresAt < new Date()) {
      throw new BadRequestException('Invitation token has expired');
    }

    if (invitation.email !== email) {
      throw new BadRequestException('Email does not match invitation');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmationToken = uuidv4();

    const role = await this.findRoleByName('employee');

    return this.prisma.client.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          roleId: role.id,
          isEmailConfirmed: false,
          confirmationToken,
        },
      });

      await tx.companyUsers.create({
        data: {
          userId: user.id,
          companyId: invitation.companyId,
        },
      });

      await tx.invitations.delete({
        where: { id: invitation.id },
      });

      return { user, company: invitation.company, confirmationToken };
    });
  }

  async createInvitation(email: string, companyId: number, creatorId: number) {
    const userExists = await this.checkUserExists(email);
    if (userExists) {
      throw new BadRequestException('User with this email already exists');
    }

    const existingInvitation = await this.prisma.client.invitations.findFirst({
      where: {
        email,
        companyId,
      },
    });

    if (existingInvitation) {
      throw new BadRequestException('Invitation for this email already exists');
    }

    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    return this.prisma.client.invitations.create({
      data: {
        token,
        email,
        companyId,
        creatorId,
        expiresAt,
      },
    });
  }

  async validateInvitation(token: string) {
    const invitation = await this.prisma.client.invitations.findUnique({
      where: { token },
      include: { company: true },
    });

    if (!invitation) {
      throw new BadRequestException('Invalid invitation token');
    }

    if (invitation.expiresAt < new Date()) {
      throw new BadRequestException('Invitation token has expired');
    }

    return invitation;
  }

  async confirmEmail(token: string) {
    const user = await this.prisma.client.user.findFirst({
      where: { confirmationToken: token },
    });

    if (!user) {
      this.logger.warn(`Invalid confirmation token: ${token}`);
      throw new BadRequestException('Invalid or expired token');
    }

    const updatedUser = await this.prisma.client.user.update({
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
