import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Module({
  controllers: [InvitationController],
  providers: [InvitationService, PrismaService, MailService],
  exports: [InvitationService],
})
export class InvitationModule {}
