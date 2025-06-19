import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import { EnvVariables } from '../../infrastructure/app-config/env-variables';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter;
  private templates: { [key: string]: string };

  constructor(private configService: ConfigService<EnvVariables>) {
    // Initialize SMTP transporter
    const gmailUser = this.configService.get<string>('SMTP_GMAIL_USER');
    const gmailPass = this.configService.get<string>('SMTP_GMAIL_PASS');
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpSenderEmail = this.configService.get<string>('SMTP_SENDER_EMAIL');

    if (gmailUser && gmailPass) {
      this.logger.log('Initializing MailService with Gmail SMTP configuration');
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });
    } else if (smtpHost && smtpSenderEmail) {
      this.logger.log(`Initializing MailService with generic SMTP configuration: ${smtpHost}`);
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: this.configService.get<number>('SMTP_PORT', 465),
        secure: this.configService.get<boolean>('SMTP_USE_SSL', true),
        auth: {
          user: this.configService.get<string>('SMTP_USER_NAME'),
          pass: this.configService.get<string>('SMTP_PASSWORD'),
        },
        tls: {
          minVersion: 'TLSv1.2',
          rejectUnauthorized: false,
        },
        debug: true,
        logger: true,
      });
    } else {
      this.logger.error('Missing required SMTP configuration: either Gmail (SMTP_GMAIL_USER, SMTP_GMAIL_PASS) or generic SMTP (SMTP_HOST, SMTP_SENDER_EMAIL) settings must be provided');
      throw new Error('SMTP configuration is incomplete');
    }

    // Load email templates
    this.templates = this.loadTemplates();
  }

  async sendConfirmationEmail(email: string, token: string) {
    try {
      const confirmationUrl = `${this.configService.get<string>('BASE_SITE_URL')}/auth/confirm-email?token=${token}`;
      const smtpSenderEmail = this.configService.get<string>('SMTP_SENDER_EMAIL', 'noreply@example.com');
      const projectName = this.configService.get<string>('PROJECT_NAME', 'Your App');
      this.logger.log(`Sending confirmation email to ${email} from ${smtpSenderEmail}`);

      const template = this.templates['confirmation-email.template.html'];
      const html = this.replacePlaceholders(template, {
        confirmationUrl,
        projectName,
      });

      await this.transporter.sendMail({
        from: smtpSenderEmail,
        to: email,
        subject: 'Confirm Your Email',
        html,
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
      const projectName = this.configService.get<string>('PROJECT_NAME', 'Your App');
      this.logger.log(`Sending invitation email to ${email} from ${smtpSenderEmail}`);

      const template = this.templates['invitation-email.template.html'];
      const html = this.replacePlaceholders(template, {
        inviteUrl,
        companyName,
        projectName,
      });

      await this.transporter.sendMail({
        from: smtpSenderEmail,
        to: email,
        subject: `Invitation to join ${companyName}`,
        html,
      });
      this.logger.log(`Invitation email sent to ${email} for company ${companyName}`);
    } catch (error) {
      this.logger.error(`Failed to send invitation email to ${email}: ${error.message}`);
      throw new Error(`Failed to send invitation email: ${error.message}`);
    }
  }

  async sendPasswordResetEmail(email: string, token: string) {
    try {
      const resetUrl = `${this.configService.get<string>('BASE_SITE_URL')}/auth/reset-password?token=${token}`;
      const smtpSenderEmail = this.configService.get<string>('SMTP_SENDER_EMAIL', 'noreply@example.com');
      const projectName = this.configService.get<string>('PROJECT_NAME', 'Your App');
      this.logger.log(`Sending password reset email to ${email} from ${smtpSenderEmail}`);

      const template = this.templates['password-reset-email.template.html'];
      const html = this.replacePlaceholders(template, {
        resetUrl,
        projectName,
      });

      await this.transporter.sendMail({
        from: smtpSenderEmail,
        to: email,
        subject: 'Reset Your Password',
        html,
      });
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}: ${error.message}`);
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }
  }

  private loadTemplates(): { [key: string]: string } {
    const templateDir = path.join(process.cwd(), 'src', 'infrastructure', 'mail', 'templates');
    const templateFiles = [
      'confirmation-email.template.html',
      'invitation-email.template.html',
      'password-reset-email.template.html',
    ];

    const templates: { [key: string]: string } = {};
    for (const file of templateFiles) {
      try {
        const filePath = path.join(templateDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        templates[file] = content;
        this.logger.log(`Loaded template: ${file}`);
      } catch (error) {
        this.logger.error(`Failed to load template ${file}: ${error.message}`);
        throw new Error(`Failed to load template ${file}: ${error.message}`);
      }
    }
    return templates;
  }

  private replacePlaceholders(template: string, placeholders: { [key: string]: string }): string {
    let result = template;
    for (const [key, value] of Object.entries(placeholders)) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return result;
  }
}