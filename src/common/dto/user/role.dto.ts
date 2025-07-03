import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PermissionDto } from '../company/set-role-permissions.dto';

export class RoleDto {
  @ApiProperty({ example: 1, description: 'Unique identifier of the role' })
  @IsInt()
  id: number;

  @ApiProperty({ example: 'Manager', description: 'Name of the role' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Manages company operations', description: 'Description of the role', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1, description: 'ID of the company the role belongs to', required: false })
  @IsOptional()
  @IsInt()
  companyId?: number;

  @ApiProperty({ example: [{ module: 'clients', read: true, create: true, update: true, delete: false }], description: 'Array of permissions for the role', required: false, isArray: true })
  @IsOptional()
  @IsArray()
  permissions?: PermissionDto[];
}
