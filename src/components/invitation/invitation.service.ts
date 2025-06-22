import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { v4 as uuidv4 } from 'uuid';
import { InviteDto } from '../../common/interfaces/auth/invite.interface';

@Injectable()
export class InvitationService {
  private readonly logger = new Logger(InvitationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async createInvite(dto: InviteDto, directorId: number) {
    this.logger.log(`Creating invitation with directorId: ${directorId}, DTO: ${JSON.stringify(dto)}`);
    const { email, companyId } = dto;

    if (!Number.isInteger(companyId) || companyId <= 0) {
      this.logger.warn(`Invalid companyId: ${companyId}`);
      throw new BadRequestException('companyId must be a positive integer');
    }

    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) {
      this.logger.warn(`Company ${companyId} not found`);
      throw new NotFoundException('Company not found');
    }

    const director = await this.prisma.user.findUnique({
      where: { id: directorId },
      include: {
        role: true, // Додано для доступу до director.role
        companyUsers: { where: { companyId }, include: { company: true, companyRoles: { include: { companyRole: true } } } },
      },
    });

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

    const invitation = await this.createInvitation(email, companyId, directorId);
    await this.mailService.sendInvitationEmail(email, invitation.token, company.name);
    this.logger.log(`Invitation created for ${email} by director ${directorId}`);
    return { message: 'Invitation created', token: invitation.token };
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
      include: { company: true },
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

  private async checkUserExists(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return !!user;
  }
}
