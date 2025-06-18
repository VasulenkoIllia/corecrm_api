import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EnvVariables } from '../../infrastructure/app-config/env-variables';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter;

  constructor(private configService: ConfigService<EnvVariables>) {
    // const smtpHost = this.configService.get<string>('SMTP_HOST');
    // const smtpSenderEmail = this.configService.get<string>('SMTP_SENDER_EMAIL');
    //
    // if (!smtpHost || !smtpSenderEmail) {
    //   this.logger.error('Missing required SMTP configuration: SMTP_HOST or SMTP_SENDER_EMAIL');
    //   throw new Error('SMTP configuration is incomplete');
    // }

    // this.logger.log(`Initializing MailService with SMTP_SENDER_EMAIL: ${smtpSenderEmail}`);

  //   this.transporter = nodemailer.createTransport({
  //     host: smtpHost,
  //     port: this.configService.get<number>('SMTP_PORT', 465),
  //     secure: this.configService.get<boolean>('SMTP_USE_SSL', true),
  //     auth: {
  //       user: this.configService.get<string>('SMTP_USER_NAME'),
  //       pass: this.configService.get<string>('SMTP_PASSWORD'),
  //     },
  //     tls: {
  //       minVersion: 'TLSv1.2',
  //       rejectUnauthorized: false,
  //     },
  //     debug: true,
  //     logger: true,
  //   });
  // }

     this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "vasulenko.illia@gmail.com",
        pass: "johr vcca ggkq xdci",
      },
    });}

  async sendConfirmationEmail(email: string, token: string) {
    try {
      const confirmationUrl = `${this.configService.get<string>('BASE_SITE_URL')}/auth/confirm-email?token=${token}`;
      const smtpSenderEmail = this.configService.get<string>('SMTP_SENDER_EMAIL', 'noreply@example.com');
      this.logger.log(`Sending confirmation email to ${email} from ${smtpSenderEmail}`);

      await this.transporter.sendMail({
        from: smtpSenderEmail,
        to: email,
        subject: 'Confirm Your Email',
        html: `<p>Please confirm your email by clicking <a href="${confirmationUrl}">here</a>.</p>`,
      });
      this.logger.log(`Confirmation email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send confirmation email to ${email}: ${error.message}`);
      throw new Error(`Failed to send confirmation email: ${error.message}`);
    }
  }

  async sendInvitationEmail(email: string, token: string, companyName: string) {
    try {
      const inviteUrl = `${this.configService.get<string>('BASE_SITE_URL')}/auth/invite/${token}`;
      const smtpSenderEmail = this.configService.get<string>('SMTP_SENDER_EMAIL', 'noreply@example.com');
      this.logger.log(`Sending invitation email to ${email} from ${smtpSenderEmail}`);

      await this.transporter.sendMail({
        from: smtpSenderEmail,
        to: email,
        subject: `Invitation to join ${companyName}`,
        html: `<p>You are invited to join ${companyName}. Register <a href="${inviteUrl}">here</a>.</p>`,
      });
      this.logger.log(`Invitation email sent to ${email} for company ${companyName}`);
    } catch (error) {
      this.logger.error(`Failed to send invitation email to ${email}: ${error.message}`);
      throw new Error(`Failed to send invitation email: ${error.message}`);
    }
  }
}
