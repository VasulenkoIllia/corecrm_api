import { IsArray, IsEmail, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleDto } from './role.dto';

class CompanyDto {
  @ApiProperty({ example: 1, description: 'Unique identifier of the company' })
  @IsInt()
  id: number;

  @ApiProperty({ example: 'Example Corp', description: 'Name of the company' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'active', description: 'Status of the company', required: false })
  @IsOptional()
  @IsString()
  status?: string;
}

export class UserMeResponseDto {
  @ApiProperty({ example: 1, description: 'Unique identifier of the user' })
  @IsInt()
  id: number;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email address of the user' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'ADMIN', description: 'Role of the user', required: false })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiProperty({ example: [{ id: 1, name: 'Example Corp', status: 'active' }], description: 'Array of companies associated with the user', isArray: true })
  @IsArray()
  companies: CompanyDto[];

  @ApiProperty({ example: [{ id: 1, name: 'ADMIN' }], description: 'Array of roles for the user in companies', isArray: true })
  @IsArray()
  companyRoles: RoleDto[];
}
