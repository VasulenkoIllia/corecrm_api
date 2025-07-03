import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterCompanyDTO {
  @ApiProperty({ example: 'john.doe@example.com', description: 'Email address of the company director' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securePass123', description: 'Password for the director account (minimum 6 characters)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the company director' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Example Corp', description: 'Name of the company' })
  @IsString()
  companyName: string;
}
