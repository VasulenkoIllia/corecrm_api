import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDTO {
  @ApiProperty({ example: 'xyz789-reset-token', description: 'Reset token received via email' })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: 'newPass123', description: 'New password for the account (minimum 6 characters)' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
