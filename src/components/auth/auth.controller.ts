import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AccessControlEndpoint } from '../../common/decorators/access-control-endpoint.decorator';
import { CatchError } from '../../common/decorators/catch-error.decorator';
import { Public } from './guards/public.guard';
import { AuthService } from './auth.service';
import { LoginResponseDTO } from '../../common/dto/user/login.response.dto';
import { LoginRequestDTO } from '../../common/dto/user/login.request.dto';
import { RegisterCompanyDTO } from '../../common/dto/auth/register-company.dto';
import { RegisterEmployeeDTO } from '../../common/dto/auth/register-employee.dto';
import { ResetPasswordDTO } from '../../common/dto/auth/reset-password.dto';
import { RequestPasswordResetDTO } from '../../common/dto/auth/request-password-reset.dto';

// Константи для модуля та дій
const MODULE_NAME = 'auth';
const ACTIONS = {
  REFRESH: 'refresh' as const,
};

/**
 * Контролер для управління авторизацією
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  /**
   * Реєструє нову компанію та її директора
   */
  @Public()
  @Post('register/company')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new company and director' })
  @ApiOkResponse({
    status: 201,
    description: 'Company and director registered successfully',
    type: class RegisterResponseDto {
      message: string;
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiBody({
    type: RegisterCompanyDTO,
    examples: {
      example1: {
        summary: 'Example of registering a company',
        value: {
          companyName: 'Example Corp',
          directorEmail: 'director@example.com',
          directorName: 'John Doe',
          password: 'securePassword123',
        },
      },
    },
  })
  @CatchError('Registering company')
  async registerCompany(@Body() registerCompanyDto: RegisterCompanyDTO) {
    this.logger.log({
      message: 'Registering company',
      method: 'registerCompany',
    });
    return this.authService.registerCompany(registerCompanyDto);
  }

  /**
   * Реєструє нового співробітника за токеном запрошення
   */
  @Public()
  @Post('register/employee')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register an employee with invitation token' })
  @ApiOkResponse({
    status: 201,
    description: 'Employee registered successfully',
    type: class RegisterResponseDto {
      message: string;
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid input data or token' })
  @ApiBody({
    type: RegisterEmployeeDTO,
    examples: {
      example1: {
        summary: 'Example of registering an employee',
        value: {
          token: 'invitation_token',
          email: 'employee@example.com',
          name: 'Jane Doe',
          password: 'securePassword123',
        },
      },
    },
  })
  @CatchError('Registering employee')
  async registerEmployee(@Body() registerEmployeeDto: RegisterEmployeeDTO) {
    this.logger.log({
      message: 'Registering employee',
      method: 'registerEmployee',
    });
    return this.authService.registerEmployee(registerEmployeeDto);
  }

  /**
   * Виконує вхід користувача
   */
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiOkResponse({
    status: 200,
    description: 'User logged in successfully',
    type: LoginResponseDTO,
  })
  @ApiBadRequestResponse({ description: 'Invalid credentials' })
  @ApiBody({
    type: LoginRequestDTO,
    examples: {
      example1: {
        summary: 'Example of user login',
        value: {
          email: 'user@example.com',
          password: 'securePassword123',
        },
      },
    },
  })
  @CatchError('User login')
  async signIn(@Body() signInDto: LoginRequestDTO): Promise<LoginResponseDTO> {
    this.logger.log({
      message: 'Processing user login',
      method: 'signIn',
    });
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  /**
   * Оновлює JWT-токен
   */
  @Post('refresh')
  @AccessControlEndpoint('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiOkResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: LoginResponseDTO,
  })
  @ApiBadRequestResponse({ description: 'Invalid refresh token' })
  @ApiForbiddenResponse({ description: 'Access denied' })
  @ApiBody({
    schema: {
      properties: {
        refreshToken: { type: 'string', example: 'refresh_token' },
      },
    },
  })
  @CatchError('Refreshing token')
  async refreshToken(@Body() refreshDto: { refreshToken: string }): Promise<LoginResponseDTO> {
    this.logger.log({
      message: 'Refreshing token',
      method: 'refreshToken',
    });
    return this.authService.refreshToken(refreshDto.refreshToken);
  }

  /**
   * Підтверджує email користувача за токеном
   */
  @Public()
  @Get('confirm-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm user email with token' })
  @ApiOkResponse({
    status: 200,
    description: 'Email confirmed successfully',
    type: class ConfirmEmailResponseDto {
      message: string;
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid or expired token' })
  @CatchError('Confirming email')
  async confirmEmail(@Query('token') token: string) {
    this.logger.log({
      message: 'Confirming email',
      method: 'confirmEmail',
    });
    return this.authService.confirmEmail(token);
  }

  /**
   * Запитує скидання пароля
   */
  @Public()
  @Post('reset-password/request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiOkResponse({
    status: 200,
    description: 'Password reset email sent successfully',
    type: class ResetPasswordRequestResponseDto {
      message: string;
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid email' })
  @ApiBody({
    type: RequestPasswordResetDTO,
    examples: {
      example1: {
        summary: 'Example of requesting password reset',
        value: {
          email: 'user@example.com',
        },
      },
    },
  })
  @CatchError('Requesting password reset')
  async requestPasswordReset(@Body() body: RequestPasswordResetDTO) {
    this.logger.log({
      message: 'Requesting password reset',
      method: 'requestPasswordReset',
    });
    return this.authService.requestPasswordReset(body.email);
  }

  /**
   * Скидає пароль за токеном
   */
  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiOkResponse({
    status: 200,
    description: 'Password reset successfully',
    type: class ResetPasswordResponseDto {
      message: string;
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid or expired token' })
  @ApiBody({
    type: ResetPasswordDTO,
    examples: {
      example1: {
        summary: 'Example of resetting password',
        value: {
          token: 'reset_token',
          newPassword: 'newSecurePassword123',
        },
      },
    },
  })
  @CatchError('Resetting password')
  async resetPassword(@Body() body: ResetPasswordDTO) {
    this.logger.log({
      message: 'Resetting password',
      method: 'resetPassword',
    });
    return this.authService.resetPassword(body.token, body.newPassword);
  }
}

