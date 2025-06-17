import { Body, Controller, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginResponseDTO } from '../../common/dto/user/login.response.dto';
import { LoginRequestDTO } from '../../common/dto/user/login.request.dto';
import { SecureEndpoint } from '../../common/decorators/secure-endpoint.decorator';
import { ApiResponse } from '../../common/decorators/api-response.decorator';
import { IsNotEmpty, IsString } from 'class-validator';
import { Endpoint } from '../../common/decorators/endpoint.decorator';
import { Public } from './guards/public.guard';

class RefreshTokenDTO {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Endpoint('login')
  @ApiResponse(LoginResponseDTO)
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

  @SecureEndpoint('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiResponse(LoginResponseDTO)
  async refreshToken(@Body() refreshDto: RefreshTokenDTO): Promise<LoginResponseDTO> {
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
}
