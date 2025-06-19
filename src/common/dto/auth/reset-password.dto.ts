import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDTO {
  @ApiProperty({ example: 'reset-token'  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}