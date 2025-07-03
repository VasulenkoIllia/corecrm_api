import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterEmployeeDTO {
  @ApiProperty({ example: 'jane.doe@example.com', description: 'Email address of the employee' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securePass123', description: 'Password for the employee account (minimum 6 characters)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Jane Doe', description: 'Full name of the employee' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'abc123-invite-token', description: 'Invitation token for employee registration' })
  @IsString()
  inviteToken: string;
}
