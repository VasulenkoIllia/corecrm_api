import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
  Req,
  RequestMethod,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginResponseDTO } from '../../common/dto/user/login.response.dto';
import { LoginRequestDTO } from '../../common/dto/user/login.request.dto';
import { Public } from './guards/public.guard';
import { RegisterCompanyDTO } from '../../common/dto/auth/register-company.dto';
import { RegisterEmployeeDTO } from '../../common/dto/auth/register-employee.dto';
import { AccessControlEndpoint } from '../../common/decorators/access-control-endpoint.decorator';
import { IAuthorizedRequest } from '../../common/interfaces/common/authorized-request.interface';
import { InviteDTO } from '../../common/dto/auth/invite.dto';
import { UserResponseDTO } from '../../common/dto/user/user.response.dto';
import { ApiResponse } from '../../common/decorators/api-response.decorator';

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
  async registerCompany(@Body() registerCompanyDto: RegisterCompanyDTO) {
    this.logger.log(`Registering company for email: ${registerCompanyDto.email}`);
    const result = await this.authService.registerCompany(registerCompanyDto);
    this.logger.log(`Company registered for email: ${registerCompanyDto.email}`);
    return result;
  }

  @Public()
  @Post('register/employee')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register an employee with an invitation token' })
  @ApiOkResponse({ status: 201, description: 'Employee registered', schema: { properties: { message: { type: 'string' } } } })
  async registerEmployee(@Body() registerEmployeeDto: RegisterEmployeeDTO) {
    this.logger.log(`Registering employee for email: ${registerEmployeeDto.email}`);
    const result = await this.authService.registerEmployee(registerEmployeeDto);
    this.logger.log(`Employee registered for email: ${registerEmployeeDto.email}`);
    return result;
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiOkResponse({ status: 200, type: LoginResponseDTO })
  async signIn(@Body() signInDto: LoginRequestDTO): Promise<LoginResponseDTO> {
    try {
      this.logger.log(`Login attempt for email: ${signInDto.email}`);
      const result = await this.authService.signIn(signInDto.email, signInDto.password);
      this.logger.log(`User logged in successfully: ${signInDto.email}`);
      return result;
    } catch (error) {
      this.logger.error(`Login failed for email: ${signInDto.email}: ${error.message}`);
      throw error;
    }
  }

  @AccessControlEndpoint('refresh', {}, RequestMethod.POST)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiOkResponse({ status: 200, type: LoginResponseDTO })
  async refreshToken(@Body() refreshDto: { refreshToken: string }): Promise<LoginResponseDTO> {
    try {
      this.logger.log(`Token refresh attempt`);
      const result = await this.authService.refreshToken(refreshDto.refreshToken);
      this.logger.log(`Token refreshed successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Token refresh failed: ${error.message}`);
      throw error;
    }
  }

  @AccessControlEndpoint('me', {}, RequestMethod.GET)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user data' })
  @ApiResponse(UserResponseDTO)
  async getMe(@Req() req: IAuthorizedRequest) {
    try {
      this.logger.log(`Fetching user data for ID: ${req.user.id}`);
      const result = await this.authService.getMe(req.user.id);
      this.logger.log(`User data retrieved for ID: ${req.user.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch user data for ID ${req.user.id}: ${error.message}`);
      throw error;
    }
  }

  @AccessControlEndpoint('invite', { requiredRole: 'director' }, RequestMethod.POST)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create an invitation link for an employee' })
  @ApiOkResponse({ status: 201, description: 'Invitation created', schema: { properties: { message: { type: 'string' }, token: { type: 'string' } } } })
  async createInvite(@Body() inviteDto: InviteDTO, @Req() req: IAuthorizedRequest) {
    this.logger.log(`Starting createInvite for user ID: ${req.user?.id}`);
    this.logger.log(`Raw request body: ${JSON.stringify(req.body)}`);
    this.logger.log(`Invite DTO before validation: ${JSON.stringify(inviteDto)}`);
    this.logger.log(`Authorized user: ${JSON.stringify(req.user)}`);
    try {
      const result = await this.authService.createInvite(inviteDto, req.user.id);
      this.logger.log(`Invitation created by user ${req.user.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to create invitation: ${error.message}, stack: ${error.stack}`);
      throw error;
    }
  }

  @Public()
  @Get('invite/:token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate an invitation token' })
  @ApiOkResponse({ status: 200, description: 'Returns invitation details', schema: { properties: { email: { type: 'string' }, company: { type: 'object' } } } })
  async validateInvite(@Param('token') token: string) {
    this.logger.log(`Validating invitation token: ${token}`);
    const result = await this.authService.validateInvite(token);
    this.logger.log(`Invitation token validated: ${token}`);
    return result;
  }

  @Public()
  @Get('confirm-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm user email with token' })
  @ApiOkResponse({ status: 200, description: 'Email confirmed', schema: { properties: { message: { type: 'string' } } } })
  async confirmEmail(@Query('token') token: string) {
    this.logger.log(`Confirming email with token: ${token}`);
    const result = await this.authService.confirmEmail(token);
    this.logger.log(`Email confirmed successfully for token: ${token}`);
    return result;
  }
}
