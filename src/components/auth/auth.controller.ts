import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post, Query, RequestMethod } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginResponseDTO } from '../../common/dto/user/login.response.dto';
import { LoginRequestDTO } from '../../common/dto/user/login.request.dto';
import { Public } from './guards/public.guard';
import { RegisterCompanyDTO } from '../../common/dto/auth/register-company.dto';
import { RegisterEmployeeDTO } from '../../common/dto/auth/register-employee.dto';
import { AccessControlEndpoint } from '../../common/decorators/access-control-endpoint.decorator';
import { ResetPasswordDTO } from '../../common/dto/auth/reset-password.dto';
import { RequestPasswordResetDTO } from '../../common/dto/auth/request-password-reset.dto';
import { CatchError } from '../../common/decorators/catch-error.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Public()

  @Post('register/company')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new company and director' })
  @ApiOkResponse({ status: 201, description: 'Company and director created', schema: { properties: { message: { type: 'string' } } } })
  @ApiBody({
    type: RegisterCompanyDTO,
  })
  @CatchError('Registering company')
  async registerCompany(@Body() registerCompanyDto: RegisterCompanyDTO) {
    return this.authService.registerCompany(registerCompanyDto);
  }

  @Public()
  @Post('register/employee')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register an employee with an invitation token' })
  @ApiOkResponse({ status: 201, description: 'Employee registered', schema: { properties: { message: { type: 'string' } } } })
  @ApiBody({type: RegisterEmployeeDTO})
  @CatchError('Registering employee')
  async registerEmployee(@Body() registerEmployeeDto: RegisterEmployeeDTO) {
    console.log(111);
    return this.authService.registerEmployee(registerEmployeeDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiOkResponse({ status: 200, type: LoginResponseDTO })
  @ApiBody({type: LoginRequestDTO})
  @CatchError('User login')
  async signIn(@Body() signInDto: LoginRequestDTO): Promise<LoginResponseDTO> {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @AccessControlEndpoint('refresh', {}, RequestMethod.POST)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiOkResponse({ status: 200, type: LoginResponseDTO })
  @CatchError('Refreshing token')
  async refreshToken(@Body() refreshDto: { refreshToken: string }): Promise<LoginResponseDTO> {
    return this.authService.refreshToken(refreshDto.refreshToken);
  }

  @Public()
  @Get('confirm-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm user email with token' })
  @ApiOkResponse({ status: 200, description: 'Email confirmed', schema: { properties: { message: { type: 'string' } } } })
  // @ApiBody({type: })
  @CatchError('Confirming email')
  async confirmEmail(@Query('token') token: string) {
    return this.authService.confirmEmail(token);
  }

  @Public()
  @Post('reset-password/request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request a password reset' })
  @ApiOkResponse({ status: 200, description: 'Password reset email sent', schema: { properties: { message: { type: 'string' } } } })
  @ApiBody({type: RequestPasswordResetDTO})
  @CatchError('Requesting password reset')
  async requestPasswordReset(@Body() body: RequestPasswordResetDTO) {
    return this.authService.requestPasswordReset(body.email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiOkResponse({ status: 200, description: 'Password reset successfully', schema: { properties: { message: { type: 'string' } } } })
  @ApiBody({type: ResetPasswordDTO})
  @CatchError('Resetting password')
  async resetPassword(@Body() body: ResetPasswordDTO) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }
}
