import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyRoleDto {
  @ApiProperty({ example: 1, description: 'ID of the company' })
  @IsInt()
  companyId: number;

  @ApiProperty({ example: 'Manager', description: 'Name of the role' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Manages company operations', description: 'Description of the role', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
